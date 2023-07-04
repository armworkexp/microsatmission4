def on_received_number(receivedNumber):
    # Power efficiency, checks every millisecond instead of every microsecond
    control.wait_micros(1000)
    # Play sound if closer than 1m.
    if abs(radio.received_packet(RadioPacketProperty.SIGNAL_STRENGTH) + 42) < 11:
        music.play(music.tone_playable(262, music.beat(BeatFraction.WHOLE)),
            music.PlaybackMode.UNTIL_DONE)
    # Log serial number of collision satellite for identification.
    datalogger.log(datalogger.create_cv("nearCollisionSats",
            radio.received_packet(RadioPacketProperty.SERIAL_NUMBER)))
radio.on_received_number(on_received_number)

# Send remote signal to tell satellite whether or not it's parachuting.

def on_button_pressed_a():
    radio.send_string("parachute")
input.on_button_pressed(Button.A, on_button_pressed_a)

# Log acceleration data during freefall in correct column.

def on_gesture_free_fall():
    basic.show_icon(IconNames.SMALL_SQUARE)
    if parachuting == 1:
        datalogger.log(datalogger.create_cv("accelerationPara", input.acceleration(Dimension.STRENGTH)))
    else:
        datalogger.log(datalogger.create_cv("accelerationNoPara", input.acceleration(Dimension.STRENGTH)))
    basic.show_icon(IconNames.YES)
input.on_gesture(Gesture.FREE_FALL, on_gesture_free_fall)

# Determine whether parachuting or not from remote signal.

def on_received_string(receivedString):
    global parachuting
    if receivedString == "parachute":
        parachuting = 1
    else:
        if receivedString == "noParachute":
            parachuting = 0
radio.on_received_string(on_received_string)

def on_button_pressed_b():
    radio.send_string("noParachute")
input.on_button_pressed(Button.B, on_button_pressed_b)

parachuting = 0
# Group 10 for collision detection
radio.set_group(10)
parachuting = 1
basic.show_icon(IconNames.YES)
# Initialize data collection for acceleration and sattelites that near collision
datalogger.set_column_titles("accelerationPara",
    "accelerationNoPara",
    "nearCollisionSats")

def on_forever():
    radio.send_number(1)
basic.forever(on_forever)
