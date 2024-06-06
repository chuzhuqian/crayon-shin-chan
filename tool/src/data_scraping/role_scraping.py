import requests
import re
from bs4 import BeautifulSoup
import pymysql


def scrape_role():
  url = 'https://baike.baidu.com/item/%E8%9C%A1%E7%AC%94%E5%B0%8F%E6%96%B0%E8%A7%92%E8%89%B2%E5%88%97%E8%A1%A8'
  headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'}
  response = requests.get(url, headers=headers)

  if response.status_code == 200:
    html_content = response.text
    soup = BeautifulSoup(html_content, 'html.parser')
    divs = soup.find_all('div', class_='paraTitle_loOFC', attrs={'data-level': '2'})
    connection = pymysql.connect(
      host='localhost',
      user='root',
      password='czq0405.',
      database='crayon_shin_chan',
      charset='utf8mb4',
      cursorclass=pymysql.cursors.DictCursor
    )
    insert_query = '''
      INSERT INTO role (cn_name, jp_name, description, avatar, cn_actor, jp_actor)
      VALUES (%(cn_name)s, %(jp_name)s, %(description)s, %(avatar)s, %(cn_actor)s, %(jp_actor)s)
    '''
    try:
      with connection.cursor() as cursor:
        slices = []
        for i in range(len(divs)):
          current_div = divs[i]
          next_div = divs[i+1] if i < len(divs)-1 else None
          sibling = current_div.next_sibling
          slice = str(current_div)
          while sibling and sibling != next_div:
            slice += str(sibling)
            sibling = sibling.next_sibling
          slices.append(slice)
        
        for slice in slices:
          obj = {
            'cn_name': '',
            'jp_name': '',
            'avatar': '',
            'jp_actor': '',
            'cn_actor': '',
            'description': '',
          }
          soup = BeautifulSoup(slice, 'html.parser')
          title = soup.find('div', class_='paraTitle_loOFC')
          obj['cn_name'] = title.text.strip()
          sibling = title.next_sibling
          avatar = sibling.find('div', class_='lemmaPicture_RpNZK')
          if avatar:
            obj['jp_name'] = sibling.text.replace(obj['cn_name'] + '日语：', '').strip()
            obj['avatar'] = avatar.img['src']
          else:
            obj['jp_name'] = sibling.text.replace('日语：', '').strip()

          all_li = soup.find_all('li')

          for li in all_li:
            text = li.text.strip()
            if text.startswith('日本配音员'):
              obj['jp_actor'] = text.replace('日本配音员：', '')
            elif text.startswith('中国台湾配音员'):
              obj['cn_actor'] = text.replace('中国台湾配音员：', '')
          
          descriptions = soup.find_all('div', class_='content_x7lm6')
          obj['description'] = ''
          for i, des in enumerate(descriptions):
            if i == 0:
              continue
            obj['description'] += des.text.strip() + '\n'
          cursor.execute(insert_query, obj)
      connection.commit()
    finally:
      connection.close()
  else:
    print("Error:", response.status_code)