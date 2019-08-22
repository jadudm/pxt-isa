
/**
 * Code to support Interactive Sound Art with a Feather and Micro:Bit.
 * MIT License
 * Copyright 2019 Matt Jadud <matt@jadud.com>
 */
// https://semantic-ui.com/elements/icon.html
// Paw f1b0
// Sound Art F519
// Headphones F025
// Bullhorn F0A1
//% weight=100 color=#881127 icon="\uF0A1"

namespace ISA {
    function delay(): void {
        basic.pause(1);
    }

    function write_cmd(ls: number[]): void {
        let crc = 0

        for (let v of ls) {
            crc = crc + v
        }

        crc = crc % 128

        // Header
        let header = pins.createBuffer(2);
        header.setNumber(NumberFormat.Int8LE, 0, 0x2A)
        header.setNumber(NumberFormat.Int8LE, 1, 0x2B)
        serial.writeBuffer(header)

        serial.writeString("<")
        serial.writeNumber(ls.length)
        serial.writeString(">")

        for (let v of ls) {
            serial.writeString("<")
            serial.writeNumber(v)
            serial.writeString(">")
        }

        serial.writeString("<")
        serial.writeNumber(crc)
        serial.writeString(">")
        serial.writeString("^")
    }

    /**
     * Sets up the serial for the board to talk to a Feather.
     */
    //% blockId="isa_setup_isa_board" block="setup_isa_board"
    export function setup_isa_board(): void {
        serial.redirect(SerialPin.P8, SerialPin.P12, 115200)
    }

    /**
     * sends a MIDI message
     * @param chan MIDI command channel
     * @param value Value to send
     */
    //% blockId="isa_midi_command" block="midi_cmd|msg %value"
    export function midi_command(msg: number[]): void {
        write_cmd(msg)
    }

    /**
     * sends a MIDI message
     * @param chan MIDI command channel
     * @param value Value to send
     */
    //% blockId="isa_midi_message" block="midi_message|chan %command_channel|value %value"
    export function midi_message(chan: number, value: number): void {
        if (value < 0) {
            value = 0
        } else if (value > 127) {
            value = 127
        }
        write_cmd([chan, value])
    }

    /**
     * sends a scaled MIDI message
     * @param chan MIDI command channel
     * @param value Value to scale
     * @param from_low Low end of input range
     * @param from_high High end of input range
     * @param to_low Low end of output range
     * @param to_high High end of output range
     */
    //% blockId="isa_midi_scaled" block="midi_scaled chan %command_channel value %value from %from_low \u2192 %from_high to %to_low \u2192 %to_high"
    //% inlineInputMode=inline
    export function midi_scaled(chan: number, value: number, from_low: number, from_high: number, to_low: number, to_high: number): void {
        value = pins.map(value, from_low, from_high, to_low, to_high);
        if (value < 0) {
            value = 0
        } else if (value > 127) {
            value = 127
        }
        write_cmd([chan, value])
    }

    /**
     * sends a MIDI on
     * @param chan Foo
     */
    //% 
    //% blockId="isa_switch_on" block="switch on chan %command_channel"
    export function switch_on(chan: number): void {
        write_cmd([chan, 1])
    }

    /**
     * sends a MIDI off
     * @param chan Foo
     */
    //% 
    //% blockId="isa_switch_off" block="switch off chan %command_channel"
    export function switch_off(chan: number): void {
        write_cmd([chan, 0])
    }

    /**
     * sends a MIDI on/off
     * @param chan Foo
     */
    //% 
    //% blockId="isa_toggle" block="toggle chan %command_channel"
    export function toggle(chan: number): void {
        write_cmd([chan, 1])
        write_cmd([chan, 0])
    }

    /**
    * sends scaled acceleromter data
    * @param axis The axis
    */
    //% blockId = isa_acceleration
    //% blockId="isa_accel" block="acceleration (scaled 0 - 127) %axis_enum"
    //% color=#D400D4
    export function acceleration(d: Dimension): number {
        return pins.map(input.acceleration(d), -1024, 1024, 0, 127);
    }
}