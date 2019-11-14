export const range = (end: number) => {
    const output = [];
    for(var i=0; i<end; i++){
        output.push(i);
    }
    return output;
}

export const until = (end: number) => {
    const output = [];
    for(var i=0; i<=end; i++){
        output.push(i);
    }
    return output;
}
