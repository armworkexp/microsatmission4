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
// Activate and deactivate motor, changing deployment stage at each point
function deployRetract () {
    deployed = !(deployed)
    automationbit.setOutput(automationbit.Output.One, 1)
    basic.pause(10630)
    automationbit.setOutput(automationbit.Output.One, 0)
    basic.pause(10630)
    deployed = !(deployed)
    automationbit.setOutput(automationbit.Output.One, 1)
    basic.pause(10630)
    automationbit.setOutput(automationbit.Output.One, 0)
}
// Determine whether parachuting or not from remote signal.
radio.onReceivedString(function (receivedString) {
    if (receivedString == "parachute") {
        parachuting = 1
    } else {
        if (receivedString == "noParachute") {
            parachuting = 0
        } else {
            if (receivedString == "deploy") {
                deployRetract()
            }
        }
    }
})
let deployed = false
let parachuting = 0
automationbit.setOutput(automationbit.Output.One, 0)
// Group 10 for collision detection
radio.setGroup(10)
parachuting = 1
deployed = false
basic.showIcon(IconNames.Yes)
// Initialize data collection for acceleration and sattelites that near collision
datalogger.setColumnTitles(
"accelerationPara",
"accelerationNoPara",
"nearCollisionSats"
)
basic.forever(function () {
    if (deployed) {
        basic.showString("D")
    } else {
        basic.showString("C")
    }
})
// Send number for collision detection
basic.forever(function () {
    radio.sendNumber(1)
})
