function DFT(signal) {

    const N = signal.length;
    let fourierY = [];
    
    for(let k = 0; k < N; k++) {
        
        let re = 0;
        let im = 0;
        
        for(let n = 0; n < N; n++) {
            
            let theta = 2 * Math.PI * k * n / N;
            
            re += signal[n] * Math.cos(theta);
            im -= signal[n] * Math.sin(theta);
        }
        
        re /= N;
        im /= N;

        let freq = k;
        let amp = Math.sqrt(re*re + im*im);
        let phase = Math.atan2(im, re);
        
        fourierY[k] = {re, im, freq, amp, phase};
    }
    return fourierY;
}