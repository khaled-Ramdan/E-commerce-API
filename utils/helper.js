export const stringToFloat = (mystring, defaultvalue) => {
    let float = parseFloat(mystring)

    if (isNaN(float) || float <= 0) {
        float = defaultvalue
    }
    return float
}
