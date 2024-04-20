// script.js

let resultsDiv = document.getElementById("results");


// Function to fetch the JSON file
async function fetchJSON() {
    const response = await fetch('data.json');
    const data = await response.json();
    return data;
}

// Function to print all category values
async function printCategories() {
    const jsonData = await fetchJSON();
    //console.log(jsonData);
    if (jsonData[0].categories) {
        let seen_categories = [];
        //console.log("All category values:");
        jsonData.forEach(element => {
            element.categories.split(" ").forEach(category => {
                if (category.includes("."))
                {
                    let index = category.indexOf(".")
                    category = category.substring(0, index);
                }
                if (!(seen_categories.includes(category)))
                {
                    seen_categories.push(category);
                }
            })
        })
        //console.log(seen_categories);
    } else {
        //console.log("No 'Categories' found in the JSON file.");
    }
}

// Function to print all category values
async function filterPapersByCategory(filterCategory) {
    const jsonData = await fetchJSON();
    //console.log(jsonData);
    if (jsonData[0].categories) {
        let matchingPapers = [];
        //console.log("All category values:");
        jsonData.forEach(element => {
            element.categories.split(" ").forEach(category => {
                if (category.includes("."))
                {
                    let index = category.indexOf(".")
                    category = category.substring(0, index);
                }
                if ((filterCategory == category || filterCategory == "All") && !matchingPapers.includes(element))
                {
                    matchingPapers.push(element);
                }
            })
        })
        return matchingPapers;
    } else {
        //console.log("No 'Categories' found in the JSON file.");
    }
}

function filterPapersByRegex(papers, pattern) {
    let matchingPapers = [];
    let matchingPapersRanked = [];
    let patternList = pattern.split(" ");
    let regexList = [];
    patternList.forEach((pattern) => {
        regexList.push(new RegExp(pattern, "i"));
    })
    /*papers.forEach((paper) => {
        regexList.forEach((regex) => {
            if ((regex.test(paper.title) || regex.test(paper.abstract) || regex.test(paper.categories)) && !matchingPapers.includes(paper)) {
                matchingPapers.push(paper);
            }
        })
    })*/
    papers.forEach((paper) => {
        regexList.forEach((regex) => {
            if ((regex.test(paper.title) || regex.test(paper.abstract) || regex.test(paper.categories))) {
                if (!matchingPapers.includes(paper)) {
                    matchingPapers.push(paper);
                    matchingPapersRanked.push([paper, 1]);
                } else {
                    matchingPapersRanked[matchingPapers.length - 1][1]++;
                }
            }
        })
    })
    matchingPapersRanked.sort((a, b) => {
        return a[1] - b[1];
    })
    matchingPapers = [];
    matchingPapersRanked.forEach((paper) => {
        matchingPapers.push(paper[0]);
    })
    return matchingPapers;
}

// Function to load papers
async function loadPapers() {
    // Clear previous results
    
    search = document.forms["search-form"]["search-input"].value;
    papers = await filterPapersByCategory(document.forms["search-form"]["field-select"].value);
    papers = filterPapersByRegex(papers, search);
    console.log(papers);
    let resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "";

    papers.forEach((paper) => {
        let container = document.createElement("div");
        container.classList.add("resultItem");
        const titleHeading = document.createElement("h2");
        const titleLink = document.createElement("a");
        titleLink.textContent = paper.title;
        titleLink.href = "https://arxiv.org/abs/" + paper.id;
        titleHeading.appendChild(titleLink);
        container.appendChild(titleHeading);
        const authorsHeading = document.createElement("h3");
        const authorsItalics = document.createElement("i");
        authorsItalics.textContent = "Authors: " + paper.authors;
        authorsHeading.appendChild(authorsItalics);
        container.appendChild(authorsHeading);
        const description = document.createElement("p");
        description.textContent = "Abstract: " + paper.abstract;
        container.appendChild(description);
        const lineBreak = document.createElement("br");
        container.appendChild(lineBreak);
        resultsDiv.appendChild(container);
        //console.log(container);
    })
}

// Function to initialize the page
function init() {
    // Attach event listener to the form submit event
    //document.getElementById("search-form").onsubmit = "loadPapers(); return false;";
}

// Call the function to initialize the page
window.onload = function() {
    init();
    printCategories();
};
