def on_received_number(receivedNumber):
    control.wait_micros(1000)
    if abs(radio.received_packet(RadioPacketProperty.SIGNAL_STRENGTH) + 42) < 11:
        music.play(music.tone_playable(262, music.beat(BeatFraction.WHOLE)),
            music.PlaybackMode.UNTIL_DONE)
    datalogger.log(datalogger.create_cv("nearCollisionSats",
            radio.received_packet(RadioPacketProperty.SERIAL_NUMBER)))
radio.on_received_number(on_received_number)

def on_button_pressed_a():
    radio.send_string("parachute")
input.on_button_pressed(Button.A, on_button_pressed_a)

def on_gesture_free_fall():
    basic.show_icon(IconNames.SMALL_SQUARE)
    if parachuting == 1:
        datalogger.log(datalogger.create_cv("accelerationPara", input.acceleration(Dimension.STRENGTH)))
    else:
        datalogger.log(datalogger.create_cv("accelerationNoPara", input.acceleration(Dimension.STRENGTH)))
    basic.show_icon(IconNames.YES)
input.on_gesture(Gesture.FREE_FALL, on_gesture_free_fall)

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
radio.set_group(199)
parachuting = 1
basic.show_icon(IconNames.YES)
datalogger.set_column_titles("accelerationPara",
    "accelerationNoPara",
    "nearCollisionSats")

def on_forever():
    radio.send_number(1)
basic.forever(on_forever)
