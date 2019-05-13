
/**
 * Code to support Interactive Sound Art at Bates College.
 * MIT License
 * Copyright 2019 Matt Jadud <mjadud@bates.edu>
 */
// 1F4BD - Minidisc
// f1b0 - Paw
//% weight=100 color=#881127 icon="\uf1b0"
namespace ISA {
    function delay(): void {
        basic.pause(1);
    }
    function writeS(s: string): void {
        serial.writeString(s);
    }
    function writeN(n: number): void {
        writeS("S")
        serial.writeNumber(n);
        writeS("E")
        delay();
    }
    /**
     * midi_message
     * @param chan MIDI command channel
     * @param value Value to send
     */
    //% blockId = isa_midi_message
    //% block="midi_message|chan %command_channel|value %value"
    export function midi_message(chan: number, value: number): void {
        writeN(chan);
        if (value < 0) {
            value = 0;
        } else if (value > 127) {
            value = 127;
        }
        writeN(value);
    }

    /**
     * midi_scaled
     * @param chan MIDI command channel
     * @param value Value to scale
     * @param from_low Low end of input range
     * @param from_high High end of input range
     * @param to_low Low end of output range
     * @param to_high High end of output range
     */
    //% blockId = isa_midi_scaled
    //% block="midi scaled chan %command_channel value %value from %from_low \u2192 %from_high to %to_low \u2192 %to_high"
    //% inlineInputMode=inline
    export function midi_scaled(chan: number, value: number, from_low: number, from_high: number, to_low: number, to_high: number): void {
        writeN(chan);
        value = pins.map(value, from_low, from_high, to_low, to_high);
        if (value < 0) {
            value = 0;
        } else if (value > 127) {
            value = 127;
        }
        writeN(value);
        basic.pause(3);
    }

    /**
     * bang
     * @param chan Foo
     * @param value Foo
     */
    //% blockId = isa_bang
    //% block="bang chan %command_channel"
    export function bang(chan: number): void {
        writeN(chan);
        writeN(1);
        writeN(chan);
        writeN(0);
    }

    enum AxisEnum {
        X = 1,
        Y = 2,
        Z = 3,
    }

    /**
    * acceleration
    * @param axis The axis
    */
    //% blockId = isa_acceleration
    //% blockId="isa_accel" block="acceleration (scaled 0 - 127) %axis_enum"
    //% color=#D400D4
    export function acceleration(d: Dimension): number {
        return pins.map(input.acceleration(d), -1024, 1024, 0, 127);
    }
}