let elon = document.querySelector(".elon")
let ratingSelect = document.getElementById('rating');
let tasksSelect = document.getElementById('tasks');

async function AllPros() {
    let pros = await fetch('allProsData.json').then(res=>res.json())
    let taskers = pros.data.taskers
    let allCards = [];

    for (let i = 0; i < taskers.length; i++) {
        let card = document.createElement("div")
        card.classList = "card"
        card.innerHTML = `
            <!-- 01 -->
            <div class="profile">
                <div class="pp">
                    <img src="${taskers[i].user.profile_picture.publicUrl}" alt="profile">
                </div>
                <div class="electric">
                    <p>${taskers[i].user.name} ${taskers[i].user.surname} <span>(elektrik)</span></p>
                    <div class="rate">
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                       <p>${taskers[i].averageRating} <span>(${taskers[i].completedTasks})</span></p>
                    </div>
                </div>
            </div>
            <!-- 02 -->
            <div class="count">
                <img src="image/verif.jpeg" alt="verified">
                <p>${taskers[i].completedTasks} Tasks</p>
                <i class="fa-solid fa-hashtag"></i>
            </div>
            <!-- 03 -->
            <div class="info">
                <p>${taskers[i].bio}</p>
            </div>
            <!-- 04 -->
            <div class="end">
                <p>view profile</p>
                <div class="price">$${Math.floor(Math.random() * 100)}</div>    <!-- Not in the data -->
                <div class="book">Book Now</div>
            </div>
            `
            elon.appendChild(card)

            // Supervisor or Top Pro
            let count = card.querySelector(".count")
            if (taskers[i].supervisor == true) {
                let supervisor = document.createElement("p")
                supervisor.classList = "cp"
                supervisor.innerHTML = `Supervisor`
                count.appendChild(supervisor)
            } else {
                let supervisor = document.createElement("p")
                supervisor.classList = "cp"
                supervisor.innerHTML = `Top Pro`
                count.appendChild(supervisor)
            
            }

            // New Pro or Not
            function difference() {
                let date = new Date()
                let startdate = taskers[i].startDate
                let start = new Date(`${startdate.substring(0, 10)}`)
                let timeDifference = date - start
                let dayDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24))
                if (dayDifference > 182) {                              // half of the year
                    let newPro = document.createElement("div")
                    newPro.classList = "cph"
                    newPro.innerHTML = `<i class="fa-regular fa-heart"></i> New Pro`
                    count.appendChild(newPro)
                }
            }
            difference()
            
            allCards.push({
                element : card,
                rating : taskers[i].averageRating,
                tasks : taskers[i].completedTasks
            })
        }

        // Filter Part
        function filters(criteria) {
            let filteredCards = allCards.filter(cardData => {
                let cp = cardData.element.querySelector('.cp');
                let cph = cardData.element.querySelector('.cph');
    
                if (criteria === 'New Pro' && cph) {
                    return true;
                } else if (criteria === 'Top Pro' && cp && cp.innerHTML !== "Supervisor" && !cph) {
                    return true;
                } else if (criteria === 'Supervisor' && cp && cp.innerHTML === "Supervisor") {
                    return true;
                } else if (criteria === 'All') {
                    return true;
                }
                return false;
            });
            sorting(filteredCards);
        }

        //Sorting Part
        function sorting(filteredCards = allCards) {
            let ratingOrder = ratingSelect.value
            let tasksOrder = tasksSelect.value
            filteredCards.sort((a, b) => {
                if (ratingOrder === 'ascending') {
                    return a.rating - b.rating;
                } else if (ratingOrder === 'descending') {
                    return b.rating - a.rating;
                }
                return 0;
            });
            filteredCards.sort((a, b) => {
                if (tasksOrder === 'ascending') {
                    return a.tasks - b.tasks;
                } else if (tasksOrder === 'descending') {
                    return b.tasks - a.tasks;
                }
                return 0;
            });
            elon.innerHTML = ''
            filteredCards.forEach(cardData => elon.appendChild(cardData.element))
        }

        let top = document.getElementById('top')
        let supert = document.getElementById('super')
        let newFilter = document.getElementById('new');
        let prost = document.getElementById('pros')
    
        top.addEventListener('click', () => {
            filters('Top Pro');
            // sorting();
        });
        supert.addEventListener('click', () => {
            filters('Supervisor');
            // sorting();
        });
        newFilter.addEventListener('click', () => {
            filters('New Pro');
            // sorting();
        });
        prost.addEventListener('click', () => {
            filters('All');
            // sorting();
        });

        ratingSelect.addEventListener('change', () => filters('All'))
        tasksSelect.addEventListener('change', () => filters('All'))

        filters('All');
}

AllPros()



