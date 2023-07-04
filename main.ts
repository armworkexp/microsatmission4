radio.onReceivedNumber(function (receivedNumber) {
    control.waitMicros(1000)
    if (Math.abs(radio.receivedPacket(RadioPacketProperty.SignalStrength) + 42) < 11) {
        music.play(music.tonePlayable(262, music.beat(BeatFraction.Whole)), music.PlaybackMode.UntilDone)
    }
    datalogger.log(datalogger.createCV("nearCollisionSats", radio.receivedPacket(RadioPacketProperty.SerialNumber)))
})
input.onButtonPressed(Button.A, function () {
    radio.sendString("parachute")
})
input.onGesture(Gesture.FreeFall, function () {
    basic.showIcon(IconNames.SmallSquare)
    if (parachuting == 1) {
        datalogger.log(datalogger.createCV("accelerationPara", input.acceleration(Dimension.Strength)))
    } else {
        datalogger.log(datalogger.createCV("accelerationNoPara", input.acceleration(Dimension.Strength)))
    }
    basic.showIcon(IconNames.Yes)
})
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
radio.setGroup(10)
parachuting = 1
basic.showIcon(IconNames.Yes)
datalogger.setColumnTitles(
"accelerationPara",
"accelerationNoPara",
"nearCollisionSats"
)
basic.forever(function () {
    radio.sendNumber(1)
})
