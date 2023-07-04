radio.onReceivedNumber(function (receivedNumber) {
    // Power efficiency, checks every millisecond instead of every microsecond
    control.waitMicros(1000)
    // Play sound if closer than 1m.
    if (Math.abs(radio.receivedPacket(RadioPacketProperty.SignalStrength) + 42) < 11) {
        music.play(music.tonePlayable(262, music.beat(BeatFraction.Whole)), music.PlaybackMode.UntilDone)
    }
    // Log serial number of collision satellite for identification.
    datalogger.log(datalogger.createCV("nearCollisionSats", radio.receivedPacket(RadioPacketProperty.SerialNumber)))
})
// Send remote signal to tell satellite whether or not it's parachuting.
input.onButtonPressed(Button.A, function () {
    radio.sendString("parachute")
})
// Log acceleration data during freefall in correct column.
input.onGesture(Gesture.FreeFall, function () {
    basic.showIcon(IconNames.SmallSquare)
    if (parachuting == 1) {
        datalogger.log(datalogger.createCV("accelerationPara", input.acceleration(Dimension.Strength)))
    } else {
        datalogger.log(datalogger.createCV("accelerationNoPara", input.acceleration(Dimension.Strength)))
    }
    basic.showIcon(IconNames.Yes)
})
// Determine whether parachuting or not from remote signal.
radio.onReceivedString(function (receivedString) {
    if (receivedString == "parachute") {
        parachuting = 1
    } else {
        if (receivedString == "noParachute") {
            parachuting = 0
        }
    }
})
input.onButtonPressed(Button.B, function () {
    radio.sendString("noParachute")
})
let parachuting = 0
// Group 10 for collision detection
radio.setGroup(10)
parachuting = 1
basic.showIcon(IconNames.Yes)
// Initialize data collection for acceleration and sattelites that near collision
datalogger.setColumnTitles(
"accelerationPara",
"accelerationNoPara",
"nearCollisionSats"
)
basic.forever(function () {
    radio.sendNumber(1)
})
