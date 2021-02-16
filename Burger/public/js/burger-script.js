const e = require("express");

document.addEventListener("DOMContentLoaded", (event) => {
    if (event) {
        console.info("DOM loaded");
      } 
    const createBurgerBtn = document.getElementById("create-form");

    if (createBurgerBtn) {
        createBurgerBtn.addEventListener("submit", (e) => {
          e.preventDefault();
    const newBurger = {
        name: document.getElementById('ca').value.trim(),
          };
    fetch(`/api/burgers/${id}`, {
        method: "POST",
        headers: {
        Accept: "application/json",
                "Content-Type": "application/json",
            },

            body: JSON.stringify(newDevouredState),
        }).then((res) => {

            document.getElementById("ca").value = '';

            console.log("new burger was made");
            location.reload();
          });
        });
      }


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