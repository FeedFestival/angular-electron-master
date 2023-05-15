import requests
import sys
import webbrowser
import bs4
from bs4.element import Comment

print("Starting")

# site1 = "http://somesite.hpwcoo.com"
# googleSite = "https://google.com/search?q=test"

# res = requests.get(googleSite)
# print(res)
# print(res.text)
# success = res.raise_for_status()
# print(success)

# soup = bs4.BeautifulSoup(res.text, "html.parser")
# print(soup)
# linkElements = soup.select('.r a')
# linkToOpen = min(5, len(linkElements))

# print(len(linkElements))

# for i in range(linkToOpen):
#     print(''+linkElements[i])
#     webbrowser.open('https://google.com'+linkElements[i].get('href'))


headers_Get = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:49.0) Gecko/20100101 Firefox/49.0',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
    'Accept-Encoding': 'gzip, deflate',
    'DNT': '1',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1'
}

def tag_visible(element):
    if element.parent.name in ['style', 'script', 'head', 'title', 'meta', '[document]']:
        return False
    if isinstance(element, Comment):
        return False
    return True


def text_from_html(soup):
    texts = soup.findAll(text=True)
    visible_texts = filter(tag_visible, texts)
    return u" ".join(t.strip() for t in visible_texts)

def google(q):
    s = requests.Session()
    q = '+'.join(q.split())
    # url = 'https://duckduckgo.com/?q=Daniel+Simionescu&t=h_&ia=web'
    url = 'https://www.bing.com/news/search?q=' + q + '&qft=interval%3d"7"&form=PTFTNR'
    r = s.get(url, headers=headers_Get)

    f = open("py/what_happened.html", "w", encoding="utf-8")
    f.write(r.text)
    f.close()

    soup = bs4.BeautifulSoup(r.text, "html.parser")

    output = []

    for link in soup.find_all('a'):
        newUrl = link.get('href')
        if (
            newUrl is not None
            and '/search?q' in newUrl
            or '/news?' in newUrl
            or '/?FORM' in newUrl
            or newUrl == '#'
            or newUrl == 'javascript: void(0);'
            or newUrl == 'javascript:void(0);'
            or newUrl == 'javascript:void(0)'
            or newUrl == 'javascript:;'
            ):
            continue
        print('--------------------')
        print(link)
        print(newUrl)
        print('-')
        print(text_from_html(link))
        print('-')


    return output


results = google('Cardano')

print("Finished")
