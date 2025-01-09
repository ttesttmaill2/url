document.querySelector('.search-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const query = document.querySelector('#search').value.trim();
    const resultsContainer = document.querySelector('#results');
    resultsContainer.innerHTML = '';

    if (query === '') {
        resultsContainer.innerHTML = '<div class="centered-message">الرجاء إدخال كلمة للبحث في الموقع.</div>';
        return;
    }

    const pages = [
        { name: 'الرئيسية', url: 'index.html' },
        { name: 'الذكاء الاصطناعي', url: 'ai.html' },
        { name: 'الصور والخلفيات', url: 'im.html' },
        { name: 'أدوات التقنية', url: 'it.html' },
        { name: 'التصميم والجرافيك', url: 'ds.html' },
    ];

    const synonyms = {
        "chat gpt": ["شات جي بي تي", "chat", "شات"],
        "ai": ["ذكاء اصطناعي", "الذكاء الاصطناعي"]
    };

    let resultsFound = false;
    let searchQueries = [query];
    let addedLinks = new Set();

    Object.keys(synonyms).forEach(key => {
        if (synonyms[key].some(syn => syn.includes(query))) {
            searchQueries = searchQueries.concat(key, ...synonyms[key]);
        }
    });

    function isArabic(text) {
        return /[\u0600-\u06FF]/.test(text);
    }

    function startsWithQuery(text, query) {
        return text.trim().toLowerCase().startsWith(query.trim().toLowerCase());
    }

    pages.forEach(page => {
        fetch(page.url)
            .then(response => response.text())
            .then(data => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(data, 'text/html');
                const links = doc.querySelectorAll('a');

                links.forEach(link => {
                    const linkHref = link.href.toLowerCase();
                    const linkText = link.textContent.toLowerCase();
                    const arabicName = link.getAttribute('data-arabic-names');

                    searchQueries.forEach(q => {
                        if (isArabic(q)) {
                            if ((startsWithQuery(linkText, q) || (arabicName && startsWithQuery(arabicName, q))) && !addedLinks.has(linkHref)) {
                                resultsFound = true;
                                addedLinks.add(linkHref);
                                const resultItem = document.createElement('div');
                                resultItem.classList.add('result-item');
                                
                                const resultLink = document.createElement('a');
                                resultLink.href = link.href;
                                resultLink.textContent = link.textContent;
                                
                                resultItem.appendChild(resultLink);
                                resultsContainer.appendChild(resultItem);
                            }
                        } else {
                            if ((startsWithQuery(linkText, q) || startsWithQuery(linkHref, q)) && !addedLinks.has(linkHref)) {
                                resultsFound = true;
                                addedLinks.add(linkHref);
                                const resultItem = document.createElement('div');
                                resultItem.classList.add('result-item');
                                
                                const resultLink = document.createElement('a');
                                resultLink.href = link.href;
                                resultLink.textContent = link.textContent;
                                
                                resultItem.appendChild(resultLink);
                                resultsContainer.appendChild(resultItem);
                            }
                        }
                    });
                });
            })
            .catch(error => console.error('Error fetching the page:', error));
    });

    setTimeout(() => {
        if (!resultsFound) {
            resultsContainer.innerHTML = '<div class="centered-message">لا توجد نتائج</div>';
        }
    }, 1000);
});
