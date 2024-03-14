const init = function () {
    const injectElement = document.createElement('button');
    injectElement.className = 'plane';
    injectElement.innerHTML = 'Hello From the Rusty Zone Element';
    document.body.appendChild(injectElement);
}
init();
