import clipboard
import webbrowser
import requests
import bs4
from bs4.element import Comment
import json

filePath = "C:/GitProjects/_money_making_machine/py/today_google_hits/test.html"
linksJsonPath = "C:/GitProjects/_money_making_machine/py/today_google_hits/links.json"

def init(name):
    val = "Checking... python works " + name
    return val;

def saveToFileFromClipboard():

    text = clipboard.paste()

    f = open(filePath, "w+", encoding="utf-8")
    f.write(text)
    f.close()

    return "Completed Saving ..."

def saveToJSONFile(text):
    f = open(linksJsonPath, "w+", encoding="utf-8")
    f.write(text)
    f.close()

    return "Completed Saving JSON..."

def openHtmlInBrowser():
    webbrowser.open('file://' + filePath)

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

def findPossibleLinks(filePath):

    f = open(filePath, "r", encoding="utf-8")
    htmlText = f.read()
    # print(htmlText)
    soup = bs4.BeautifulSoup(htmlText, "html.parser")

    output = []
    allAs = soup.find_all('a')

    # if allAs == None:
    #     print('no <a s')
    # else:
    #     print('<a count: ', len(allAs))

    for link in allAs:
        # print('--------------------')
        # print('link: ', link)
        newUrl = link.get('href')
        # print('newUrl: ', newUrl)

        isUrl = newUrl is not None

        if isUrl == True:

            # print('-')

            if ('/search?q' in newUrl
                or '/news?' in newUrl
                or '/?FORM' in newUrl
                or newUrl == '#'
                or newUrl == 'javascript: void(0);'
                or newUrl == 'javascript:void(0);'
                or newUrl == 'javascript:void(0)'
                or newUrl == 'javascript:;'
                ):
                continue

            textInside = text_from_html(link)
            # print('text_from_html(): ', textInside)

            jsonString = {
                "link": link.attrs,
                "url": newUrl,
                "text": textInside
            }

            # print('jsonString: ', jsonString)

            output.append(jsonString)

            # print('-')

    # print ('', json.dumps(output))
    saveToJSONFile(json.dumps(output))
    # for val in output:
    #     print('', json.dumps(val))
    return "Complete ... "

# saveToFileFromClipboard()
# openFile()
# findPossibleLinks(filePath)
