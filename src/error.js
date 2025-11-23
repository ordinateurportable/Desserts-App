export function printError(error) {
  const errorMarkup = `<div class="error-message">
    ${error.message}
  </div>`   
  
  document.body.insertAdjacentHTML("beforeend", errorMarkup);
    setTimeout(() => {
      document.querySelector(".error-message").remove();
    }, 3000);
}

