const debugConfig = {
    allowDebug: true
}


export const log = message => {
    if (debugConfig.allowDebug) {
        console.log(message);
    }
}