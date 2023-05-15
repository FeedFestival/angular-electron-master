
_site = 'https://www.google.com/search?'
_q = 'q='
_newWindow = '&newwindow=1'
_tbs = '&tbs=qdr:d'
# sxsrf
_ei = '&ei=Ls-iYPDfHsT9qwHK_YegDw'
_start = '&start=100'
_sa = '&sa=N'
_ved = '&ved=2ahUKEwjwrt2uxNHwAhXE_ioKHcr-AfQQ8tMDegQIARA3'
_biw = '&biw=1920'
_bih = '&bih=969'

def getSearchQuery(searchWord, page):

    milisecondsToday = '1621282606513'
    sxsrf = '&sxsrf=ALeKk02tZzhKlPRfvfZZjufpW6CzoUdzLg:' + milisecondsToday

    start = ''
    if page is not None and page != 0:
        start = _start
    querry = _site + _q + searchWord + _newWindow + _tbs + sxsrf + _ei + start + _sa + _ved + _biw + _bih
    print(querry)
    return querry

# getSearchQuery('cardano', 0)
