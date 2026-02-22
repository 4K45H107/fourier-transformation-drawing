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

class Complex {
    constructor(a, b) {
        this.re = a;
        this.im = b;
    }
  
    add(c) {
        this.re += c.re;
        this.im += c.im;
    }
  
    mult(c) {
      const re = this.re * c.re - this.im * c.im;
      const im = this.re * c.im + this.im * c.re;
      
      return new Complex(re, im);
    }
  }

function DFT_Complex(signal) {

    const fourier = [];
    const N = signal.length;

    for (let k = 0; k < N; k++) {

        let sum = new Complex(0, 0);

        for (let n = 0; n < N; n++) {
            const phi = (2 * Math.PI * k * n) / N;
            const c = new Complex(Math.cos(phi), -Math.sin(phi));
            sum.add(signal[n].mult(c));
        }

        sum.re = sum.re / N;
        sum.im = sum.im / N;
  
        let freq = k;
        let amp = Math.sqrt(sum.re * sum.re + sum.im * sum.im);
        let phase = Math.atan2(sum.im, sum.re);
        
        fourier[k] = { re: sum.re, im: sum.im, freq, amp, phase };
    }

    return fourier;
}