const parent = document.querySelector('.container');
let currentPage = 1;
let limit = 10;
parent.addEventListener('click', (element) => {
    console.log(element.target.innerText, typeof element.target.innerText);
    if (!element.target.id) return;
    if (element.target.id === 'next') {
        currentPage += 1;
        initialLoad(currentPage, limit);
    } else if (element.target.id === 'prev') {
        currentPage -= 1;
        initialLoad(currentPage, limit);
    } else {
        currentPage = + element.target.innerText;
        initialLoad(+ element.target.innerText, limit)
    }

});
function paginationTemplate(start, end, result) {
    for (let i = start; i <= end; i++) {
        const child = document.createElement('button');
        child.className = "inner__page";
        child.id = i;
        child.innerText = i;
        if (result.previous?.page + 1 === i) {
            child.classList.add("current__page")
        } else if (result.next?.page - 1 === i) {
            child.classList.add("current__page")
        }
        parent.appendChild(child)
    }
}
function leftPagination() {
    const firstChild = document.createElement('button');
    firstChild.className = "inner__page";
    firstChild.id = 1;
    firstChild.innerText = 1;
    parent.appendChild(firstChild);
    const child = document.createElement('button');
    child.className = "inner__page";
    child.id = "dot";
    child.innerText = "...";
    parent.appendChild(child);
}
function rightPagaination(result) {
    const child = document.createElement('button');
    child.className = "inner__page";
    child.id = "dot";
    child.innerText = "...";
    parent.appendChild(child);
    const lastChild = document.createElement('button');
    lastChild.className = "inner__page";
    lastChild.id = Math.ceil(result.totalSize / limit);
    lastChild.innerText = Math.ceil(result.totalSize / limit);
    parent.appendChild(lastChild);
}
function createTemplate(result = '') {
    document.querySelector('.container').innerHTML = '';
    document.querySelector('.content').innerHTML = '';
    const author=document.getElementsByClassName('content')[0];
    for(let i=0;i<result.results.length;i++){
        const child=document.createElement('div');
        child.className="author";
        child.innerText=result.results[i].author;
        author.appendChild(child);
    }
    const leftArrow = document.createElement('button');
    leftArrow.className = "fas fa-angle-double-left inner__page";
    leftArrow.id = "prev"
    parent.appendChild(leftArrow);
    if (Math.ceil(result.totalSize / limit) <= 5) {
        paginationTemplate(1, Math.ceil(result.totalSize / limit), result)
    }
    else if (currentPage < 5) {
        paginationTemplate(1, 5, result)
        rightPagaination(result);

    } else if ((Math.ceil(result.totalSize / limit) - currentPage) < 4) {
        leftPagination()
        paginationTemplate(Math.ceil(result.totalSize / limit) - 4, Math.ceil(result.totalSize / limit), result)

    } else if (currentPage >= 5) {
        leftPagination();
        paginationTemplate(currentPage - 1, currentPage + 2, result)
        rightPagaination(result);
    }
    const rightArrow = document.createElement('button');
    rightArrow.className = "fas fa-angle-double-right inner__page";
    rightArrow.id = "next";
    parent.appendChild(rightArrow);
    if (currentPage === 1) {
        document.getElementById("prev").disabled = true;
    }
    if (currentPage * limit >= result.totalSize) {
        document.getElementById("next").disabled = true;
    }

}
async function initialLoad(page, limit) {
    const data = await fetch(`http://localhost:3000/users?page=${page}&limit=${limit}`);
    const result = await data.json();
    console.log(result);
    createTemplate(result)
}

initialLoad(1, limit);
