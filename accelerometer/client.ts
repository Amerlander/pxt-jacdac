namespace jacdac {
    //% fixedInstances
    export class AccelerometerClient extends jacdac.BufferedSensorClient<number[]> {
        constructor(requiredDevice: string = null) {
            super("acc", jacdac.SRV_ACCELEROMETER, requiredDevice);
        }

        protected parseSample(packet: jacdac.JDPacket) {
            return packet.jdunpack<[number, number, number]>("i6.10 i6.10 i6.10")
        }

        /**
         * Reads the current x value from the sensor
         */
        get x(): number {
            return this.get(JDDimension.X);
        }

        /**
         * Reads the current y value from the sensor
         */
        get y(): number {
            return this.get(JDDimension.Y);
        }

        /**
         * Reads the current z value from the sensor
         */
        get z(): number {
            return this.get(JDDimension.Z);
        }

        /**
         * Reads the current strength value from the sensor
         */
        get strength(): number {
            return this.get(JDDimension.Strength);
        }


        /**
         * Reads a value of the sensor
         * @param dimension which channel to read
         */
        //% blockId=jacdacaccget block="jacdac %accelerometer %dimension"
        //% group="Accelerometer" weight=5
        get(dimension: JDDimension): number {
            const s = this.state;
            if (!s || s.length < 6) return 0;
            switch (dimension) {
                case JDDimension.X:
                case JDDimension.Y:
                case JDDimension.Z:
                    return s.getNumber(NumberFormat.Int16LE, dimension * 2);
                default: // strength
                    let r = 0;
                    for (let i = 0; i < 3; ++i) {
                        const x = s.getNumber(NumberFormat.Int16LE, i * 2);
                        r += x * x;
                    }
                    return Math.sqrt(r);
            }
        }

        /**
         * Runs code when an event happens on the sensor
         * @param gesture 
         * @param handler 
         */
        //% blockId=jacadacacconevent block="jacdac %accelerometer on %gesture"
        //% group="Accelerometer"
        onEvent(gesture: jacdac.AccelerometerEvent, handler: () => void) {
            this.registerEvent(gesture, handler);
        }
    }
}
namespace modules {
    //% fixedInstance whenUsed
    export const accelerometer = new jacdac.AccelerometerClient();
}