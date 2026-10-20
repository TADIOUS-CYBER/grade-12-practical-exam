
const ethicsAnswers = {
    issue1: "plagiarism",
    action1: "cite",
    issue2: "privacy",
    action2: "respect",
    issue3: "unauthorized",
    action3: "protect",
    issue4: "piracy",
    action4: "licensed",
    issue5: "defamation",
    action5: "verify"
};

const ethicsForm = document.getElementById("ethicsForm");
const ethicsResult = document.getElementById("ethicsResult");

ethicsForm.addEventListener("submit", function (event) {
    event.preventDefault();

    let score = 0;
    let output = "<h3>Answer Review</h3>";

    for (const key in ethicsAnswers) {
        const selected = ethicsForm.elements[key].value;
        const correct = selected === ethicsAnswers[key];

        if (correct) score++;

        output += "<p>" + key.replace(/([0-9]+)/, " $1") +
            ": " + (correct ? "Correct" :
            "Incorrect — correct answer: " + ethicsAnswers[key]) +
            "</p>";
    }

    output = "<h3>Score: " + score +
        " / 10 (" + (score * 10) + "%)</h3>" + output;

    ethicsResult.className = "result";
    ethicsResult.innerHTML = output;
});

ethicsForm.addEventListener("reset", function () {
    ethicsResult.innerHTML = "";
    ethicsResult.className = "";
});


// Activity 2: Build the five-person survey.

const surveyQuestions = [
    {
        key: "hours",
        text: "How many hours per day do you use a smartphone?",
        options: [
            ["0-2", "0–2 hours"],
            ["3-5", "3–5 hours"],
            ["6+", "6 or more hours"]
        ]
    },
    {
        key: "education",
        text: "Do you use the internet for educational purposes?",
        options: [
            ["yes", "Yes"],
            ["no", "No"]
        ]
    },
    {
        key: "bullying",
        text: "Have you encountered cyberbullying?",
        options: [
            ["yes", "Yes"],
            ["no", "No"],
            ["unsure", "Not sure"]
        ]
    },
    {
        key: "social",
        text: "Do you use social media?",
        options: [
            ["yes", "Yes"],
            ["no", "No"]
        ]
    }
];

const surveyQuestionsDiv =
    document.getElementById("surveyQuestions");

for (let person = 1; person <= 5; person++) {
    const section = document.createElement("div");
    section.className = "survey-person";
    section.innerHTML = "<h3>Classmate " + person + "</h3>";

    surveyQuestions.forEach(function (question) {
        const label = document.createElement("label");
        label.textContent = question.text;

        const select = document.createElement("select");
        select.name = "p" + person + "_" + question.key;
        select.required = true;

        const placeholder = document.createElement("option");
        placeholder.value = "";
        placeholder.textContent = "Select an answer";
        select.appendChild(placeholder);

        question.options.forEach(function (option) {
            const item = document.createElement("option");
            item.value = option[0];
            item.textContent = option[1];
            select.appendChild(item);
        });

        section.appendChild(label);
        section.appendChild(select);
    });

    surveyQuestionsDiv.appendChild(section);
}

const surveyForm = document.getElementById("surveyForm");
const surveyResult = document.getElementById("surveyResult");

surveyForm.addEventListener("submit", function (event) {
    event.preventDefault();

    let output = "<h3>Survey Summary (5 classmates)</h3>";

    surveyQuestions.forEach(function (question) {
        const counts = {};

        question.options.forEach(function (option) {
            counts[option[0]] = 0;
        });

        for (let person = 1; person <= 5; person++) {
            const value = surveyForm.elements[
                "p" + person + "_" + question.key
            ].value;

            counts[value]++;
        }

        output += "<h4>" + question.text + "</h4><ul>";

        question.options.forEach(function (option) {
            const count = counts[option[0]];
            const percent = count * 20;

            output += "<li>" + option[1] + ": " +
                count + " classmates (" + percent + "%)</li>";
        });

        output += "</ul>";
    });

    surveyResult.className = "result";
    surveyResult.innerHTML = output;
});

surveyForm.addEventListener("reset", function () {
    surveyResult.innerHTML = "";
    surveyResult.className = "";
});


// Create a Word-compatible document.

document.getElementById("downloadDoc").addEventListener(
    "click", function () {
        const name = document.getElementById("studentName").value.trim();

        const rules = [1, 2, 3, 4, 5].map(function (number) {
            return document.getElementById("rule" + number)
                .value.trim();
        });

        if (rules.some(function (rule) { return !rule; })) {
            alert("Please write all five ethical rules first.");
            return;
        }

        const escapeHTML = function (text) {
            return text.replace(/[&<>"']/g, function (char) {
                return {
                    "&": "&amp;",
                    "<": "&lt;",
                    ">": "&gt;",
                    '"': "&quot;",
                    "'": "&#39;"
                }[char];
            });
        };

        const paragraphs = rules.map(function (rule, index) {
            return "<p>" + (index + 1) + ". " +
                escapeHTML(rule) + "</p>";
        }).join("");

        const documentHTML =
            '<html xmlns:o="urn:schemas-microsoft-com:office:office" ' +
            'xmlns:w="urn:schemas-microsoft-com:office:word" ' +
            'xmlns="http://www.w3.org/TR/REC-html40">' +
            '<head><meta charset="utf-8"><title>' +
            'Responsible Use of Information Systems</title></head>' +
            '<body><h1>Responsible Use of Information Systems</h1>' +
            '<p>Student Name: ' + escapeHTML(name || "____________") +
            '</p><h2>Five Rules for Ethical Computer and Internet Use</h2>' +
            paragraphs + '</body></html>';

        const blob = new Blob(
            ["\ufeff", documentHTML],
            { type: "application/msword" }
        );

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "Ethical_Use_Grade12.doc";
        link.click();

        URL.revokeObjectURL(url);
    }
);
