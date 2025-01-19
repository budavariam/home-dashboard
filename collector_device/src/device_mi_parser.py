from struct import unpack
from device_util import log, timestamp
# def time(): return "101" # for local run


def parse_bthomev2_data(inputdata: memoryview):
    """
    https://bthome.io/format/
    example: 020106 0e 16 d2fc 40 009d 0153 026a0a 037115
    ADV packets: 020106

    length: 0x0e
    service type: 0x16

    UUID: d2fc -> FC D2
    BTHome Device Information: 40
    packet ID: 009d
    battery: 0153 -> 83%
    temperature: 026a0a -> 26.66 (read as 16bit and divide by 100)
    humidity: 03 7115 -> 54.89

    020106 0f 16 95fe30585b052eb80c3638c1a408

    """
    try:
        res = {"updated_at": timestamp()}
        start = 0
        curr = 0
        advpacket = bytes(inputdata[0:3])
        if advpacket == b"\x02\x01\x06":
            start = len(advpacket)
            curr += 3  # step over AD elements
        p_length = unpack("B", inputdata[curr : curr + 1])[0]
        curr += 1  # step over length
        service_data = inputdata[curr] == 0x16
        if not service_data:
            return res
        curr += 1
        (uuid,) = unpack("<H", inputdata[curr : curr + 2])
        if uuid == 0xFCD2:
            curr += 2  # step over uuid
            curr += 1  # step over 0x40

            while curr < start + p_length:
                # log(inputdata[curr])
                t = inputdata[curr]  # type of element
                curr += 1  # step over type
                if t == 0x00:
                    # log("packet id")
                    v = unpack("B", inputdata[curr : curr + 1])[0]
                    res["pid"] = v
                    curr += 1
                elif t == 0x01:
                    # log("battery uint8")
                    v = unpack("B", inputdata[curr : curr + 1])[0]
                    res["bat"] = v
                    curr += 1
                elif t == 0x09:
                    # log("count uint 1b")
                    v = unpack("B", inputdata[curr : curr + 1])[0]
                    res["count"] = v
                    curr += 1
                elif t == 0x3D:
                    # log("count uint 2b")
                    v = unpack("<H", inputdata[curr : curr + 2])[0]
                    res["count"] = v
                    curr += 2
                elif t == 0x3E:
                    # log("count uint 4b")
                    v = unpack("<I", inputdata[curr : curr + 2])[0]
                    res["count"] = v
                    curr += 4
                elif t == 0x03:
                    # log("humidity 2b uint16")
                    v = unpack("<H", inputdata[curr : curr + 2])[0]
                    res["hum"] = v / 100
                    curr += 2
                elif t == 0x2E:
                    # log("humidity 1b uint8")
                    v = unpack("B", inputdata[curr : curr + 2])[0]
                    res["hum"] = v
                    curr += 1
                elif t == 0x45:
                    # log("temperature sint16 v1 0.1")
                    v = unpack("<h", inputdata[curr : curr + 2])[0]
                    res["tmp"] = v / 10
                    curr += 2
                elif t == 0x02:
                    # log("temperature sint16 v2 0.01")
                    v = unpack("<h", inputdata[curr : curr + 2])[0]
                    res["tmp"] = v / 100
                    curr += 2
                elif t == 0x0B:
                    # log("power uin24 3b 0.01")
                    v = unpack("<I", inputdata[curr : curr + 3])[0]
                    res["pow"] = v / 100
                    curr += 3
                elif t == 0x0C:
                    # log("voltage uint16 (2 bytes) 0.001")
                    v = unpack("<H", inputdata[curr : curr + 2])[0]
                    res["pow"] = v / 1000
                    curr += 2
                elif t == 0x10:
                    # log("power uint8 (1 byte)")
                    v = unpack("B", inputdata[curr : curr + 1])[0]
                    res["operating"] = v
                    curr += 1
                else:
                    log(f"type unknown, break: {t}")
                    return res
        elif uuid == 0xFE95:
            curr += 2  # step over uuid
            curr += 1  # step over 0x40
            while curr < start + p_length:
                t = inputdata[curr]  # type of element
                curr += 1  # step over type
                if t == 0x1004:  # temp
                    v = unpack("<h", inputdata[curr : curr + 2])[0]
                    res["temp"] = v / 10
                    curr += 2
                elif t == 0x1006:  # hum
                    v = unpack("<H", inputdata[curr : curr + 2])[0]
                    res["hum"] = v / 10
                    curr += 2
                elif t == 0x100A:  # battery
                    v = unpack("<B", inputdata[curr : curr + 1])[0]
                    res["bat"] = v
                    curr += 1
                elif t == 0x100D:  # temp+hum
                    temp, hum = unpack("<hH", inputdata[curr : curr + 4])
                    res["temp"] = temp / 10
                    res["hum"] = hum / 10
                    curr += 4
    except Exception as e:
        log(f"Error during parsing data: {e}")
    return res
