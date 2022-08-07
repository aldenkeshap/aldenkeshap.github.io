function footnote(n) {
    let a = document.getElementsByClassName('footnote-button')[n - 1];
    let note = document.getElementsByClassName('footnote')[n - 1]
    if (a.innerHTML == '+') {
        note.classList.add('footnote-shown');
        note.classList.remove('footnote-hidden');
        a.innerHTML = '-';
    } else {
        note.classList.remove('footnote-shown');
        note.classList.add('footnote-hidden');
        a.innerHTML = '+';
    }
}

function submit() {
    const email = document.getElementById('feedback-email');
    const feedback = document.getElementById('feedback-box');
    console.log("SUBMIT", email.value, feedback.value);
    let formData = new FormData();
    formData.append('url', window.location.href);
    formData.append('email', email.value);
    formData.append('feedback', feedback.value);

    fetch('https://aldenkeshap.pythonanywhere.com/feedback', {
        method: 'POST',
        mode: 'no-cors',
        body: formData,
        // headers: {
        //     'Content-Type':'application/x-www-form-urlencoded',
        // },
    }).then((response) => {
        console.log("RESP", response);
        
        const r = document.getElementById('response');
        r.innerText = 'Success! Thanks for your feedback';
        email.value = '';
        feedback.value = '';
    });
    
}