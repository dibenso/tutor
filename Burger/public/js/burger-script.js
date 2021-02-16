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
        }).then(response => {
            if(response.ok) {
                burgerName.value = '';

                console.log("new burger was made");
                window.location.reload();
            }
        });
    })

    const changeDevourBtn = document.querySelectorAll(".change-devoured");
    changeDevourBtn.forEach((button) => {
        button.addEventListener("click", (e) => {
            const id = e.target.getAttribute("data-id");
            const devourState = !!parseInt(e.target.getAttribute("data-devoured"));
            const newDevouredState = !devourState;

            fetch(`/api/burgers/${id}`, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({devoured: newDevouredState}),
            }).then((response) => {
                if (response.ok) {
                    console.log(`changed devoured/eaten to: ${newDevouredState}`);
                    window.location.reload();
                } else {
                    alert('something went wrong!');
                }
            });
        });
    });
});