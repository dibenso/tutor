document.addEventListener("DOMContentLoaded", (event) => {
    if (event) {
        console.info("DOM loaded");
    }

    const createForm = document.getElementById("create-form");

    createForm.addEventListener('submit', event => {
        event.preventDefault();
        const burgerName = document.getElementById('ca');
        const newBurger = { burger_name: burgerName.value, devoured: false };

        fetch('/api/burgers', {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newBurger)
        }).then(res => {
            burgerName.value = '';

            console.log("new burger was made");
            window.location.reload();
        });
    })

    const changeDevourBtn = document.querySelectorAll(".change-devoured"); 
    if (changeDevourBtn) {
        changeDevourBtn.forEach((button) => {
            button.addEventListener("click", (e) => {
                const id = e.target.getAttribute("data-id");
                var devourState = e.target.getAttribute("data-devoured");
    const newDevouredState = true;
    console.log(newDevouredState)

    fetch(`/api/burgers/${id}`, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({devoured: newDevouredState}),
    }).then((response) => {

            if (response.ok) {
                console.log(`changed devoured/eaten to: ${newDevouredState}`);
                location.reload('/');
              } else {
                alert('something went wrong!');
              }
            });
          });
        });
      }
    
    });