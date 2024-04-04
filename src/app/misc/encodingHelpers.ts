
export const uint8ArrayToHexString = (uint8Array: Uint8Array) => {
    return Array.from(uint8Array)
        .map(byte => byte.toString(16).padStart(2, '0'))
        .join('');
}

export const hexStringToUint8Array = (hexString: string): Uint8Array => {
    const arrayBuffer = new ArrayBuffer(hexString.length / 2);
    const uint8Array = new Uint8Array(arrayBuffer);

    for (let i = 0; i < hexString.length; i += 2) {
        uint8Array[i / 2] = parseInt(hexString.substr(i, 2), 16);
    }

    return uint8Array;
}

export const publicKeyToUncompressed = (publicKeyHexString: string) => {

    // Если это некомпактный формат, разделите строку на координаты x и y
    const xCoordHexString = publicKeyHexString.substr(2, 64); // Первые 64 символа
    const yCoordHexString = publicKeyHexString.substr(66, 64); // Следующие 64 символа

    // Преобразуйте каждую координату в массив байтов
    const xCoordBytes = hexStringToUint8Array(xCoordHexString);
    const yCoordBytes = hexStringToUint8Array(yCoordHexString);

    // Создайте публичный ключ в нужном формате (например, некомпактный)
    const uncompressedPublicKey = new Uint8Array(65);
    uncompressedPublicKey[0] = 0x04; // Префикс некомпактного ключа
    uncompressedPublicKey.set(xCoordBytes, 1); // Координата x
    uncompressedPublicKey.set(yCoordBytes, 33); // Координата y

    return uncompressedPublicKey;
}