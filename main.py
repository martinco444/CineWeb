import requests
import pandas as pd
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
from selenium.webdriver.support.ui import Select
from selenium.common.exceptions import NoSuchElementException
from selenium.common.exceptions import ElementNotInteractableException


def peliculas_cinecolombia():

    funciones = ""
    funciones_set = set()
    url = 'https://www.cinecolombia.com/cali/cartelera'

    response = requests.get(url)

    if response.status_code == 200:
        soup = BeautifulSoup(response.text, 'html.parser')
        peliculas = soup.find_all('a', class_='movie-item')
        
        for pelicula in peliculas:

            titulo = pelicula.find('h2', class_='movie-item__title').text.strip()
            metas = pelicula.find_all('span', class_='movie-item__meta')
            tags = pelicula.find_all('span', class_='tag')
            img_tag = pelicula.find('img')
            img = img_tag.get('data-src')
            
            generos = []
            duracion = ""
            clasificacion = ""

            for meta in metas:
                texto = meta.text.strip()

                if "Género:" in texto:
                    generos.extend([g.strip() for g in texto.replace("Género:", "").split(',')])

            for tag in tags:
                texto = tag.text.strip()
                if "Min" in texto:
                    duracion = texto.strip()
                elif "Recomendada" or "Para" or "Exclusiva" in texto:
                    clasificacion = texto.strip()

            enlace_pelicula = pelicula['href']
            url_pelicula = f'https://www.cinecolombia.com{enlace_pelicula}'

            response_pelicula = requests.get(url_pelicula)

            if response_pelicula.status_code == 200:
                soup_pelicula = BeautifulSoup(response_pelicula.text, 'html.parser')
                detalles_pelicula = soup_pelicula.find_all('div', class_='movie-details__block')

                for detalle in detalles_pelicula:
                    elemento_p = detalle.find('p')

                    if elemento_p:
                        texto = elemento_p.string
                        if not texto:
                            texto = ''.join([str(c) for c in elemento_p.contents])

                        texto = texto.strip()

                        posicion = detalles_pelicula.index(detalle)

                        if posicion == 0:
                            sinopsis = ' '.join(texto.split())
                        elif posicion == 1:
                            titulo_original = texto
                        elif posicion == 2:
                            pais_origen = ' '.join(texto.split())
                        elif posicion == 3:
                            director = texto
                        elif posicion == 4:
                            actores = texto
                        elif posicion == 5:
                            idioma = texto
                         
            if titulo not in funciones_set:
                funciones += (f'{titulo}|')
                funciones += (f'{duracion}|')
                funciones += (f'{clasificacion}|')
                funciones += (f'{", ".join(generos)}|')
                funciones += "CineColombia|"
                funciones += f'{titulo_original}|'
                funciones += f'{pais_origen}|'
                funciones += f'{director}|'
                funciones += f'{actores}|'
                funciones += f'{idioma}|'
                funciones += f'{img}|'
                funciones += f'{sinopsis}\n'

                funciones_set.add(titulo)
    else:
        print('La solicitud al sitio web del cine no fue exitosa.')

    return funciones

def funciones_cinecolombia():
    funciones = ""
    url = 'https://www.cinecolombia.com/cali/cartelera'
    driver = webdriver.Chrome()
    driver.get(url)
    links = []

    peliculas = WebDriverWait(driver, 10).until(
        EC.presence_of_all_elements_located((By.CLASS_NAME, 'movie-item'))
    )

    for pelicula in peliculas:
        try:
            link_pelicula = pelicula.get_attribute('href')
            links.append(link_pelicula)

        except: continue

    for link in links:
        try:
            driver.get(link)

            titulo = driver.find_element(By.CLASS_NAME, 'ezstring-field').text

            salas = WebDriverWait(driver, 10).until(
                EC.presence_of_all_elements_located((By.CLASS_NAME, 'collapsible'))
            )

            time.sleep(2)
            for sala in salas:
                try:
                    sala_nombre = sala.find_element(By.CLASS_NAME, 'show-times-collapse__title').text.strip()
                    sala.click()
                    time.sleep(1)

                    horarios_element = WebDriverWait(driver, 10).until(
                        EC.presence_of_all_elements_located((By.CLASS_NAME, 'show-times-group__times'))
                    )

                    formatos_element = WebDriverWait(driver, 10).until(
                        EC.presence_of_all_elements_located((By.CLASS_NAME, 'show-times-group__attrs'))
                    )

                    horarios = [horario.text.replace('\n', ', ') for horario in horarios_element if horario.text.strip() != '']
                    formatos = [formato.text.replace('\n', ' ') for formato in formatos_element if formato.text.strip()]

                    for formato, horario in zip(formatos, horarios):
                        funciones += f'{titulo}|'
                        funciones += f'CineColombia {sala_nombre}|'
                        funciones += f'{formato}|'
                        funciones += f'{horario}|'
                        funciones += f'{link}\n'

                except: continue

        except: continue

        driver.get(url)

    driver.quit()
    return funciones

def peliculas_cinepolis():
    funciones = ""
    driver = webdriver.Chrome()
    url = 'https://cinepolis.com.co/cartelera/cali-colombia'

    driver.get(url)

    peliculas = WebDriverWait(driver, 10).until(
        EC.presence_of_all_elements_located((By.CLASS_NAME, 'tituloPelicula'))
    )

    for pelicula in peliculas:
        try:
            titulo = pelicula.find_element(By.CLASS_NAME, 'datalayer-movie').text.strip()
            duracion = pelicula.find_element(By.CLASS_NAME, 'duracion').text.strip()
            clasificacion = pelicula.find_element(By.CLASS_NAME, 'clasificacion').text.strip()
            datos_pelicula = pelicula.find_element(By.CLASS_NAME, 'data-layer')
            generos = datos_pelicula.get_attribute('data-genero')
            director = datos_pelicula.get_attribute('data-director')
            actores = ', '.join(
                datos_pelicula.get_attribute('data-actor').replace('"', '').replace('[', '').replace(']', '').split(', '))
            titulo_original = datos_pelicula.get_attribute('data-titulooriginal')
            img = pelicula.find_element(By.TAG_NAME, 'img').get_attribute('src')

            funciones += f'{titulo}|'
            funciones += f'{duracion}|'
            funciones += f'{clasificacion}|'
            funciones += f'{generos}|'
            funciones += f'Cinepolis|'
            funciones += f'{titulo_original}|'
            funciones += f'|'  # País de origen
            funciones += f'{director}|'
            funciones += f'{actores}|'
            funciones += f'|'  # Idioma
            funciones += f'{img}|'
            funciones += f'|\n'  # Sinopsis

        except: continue

    driver.quit()
    return funciones

def funciones_cinepolis():
    funciones = ""
    driver = webdriver.Chrome()  
    url = 'https://cinepolis.com.co/cartelera/cali-colombia'

    driver.get(url)

    peliculas = WebDriverWait(driver, 10).until(
        EC.presence_of_all_elements_located((By.CLASS_NAME, 'tituloPelicula'))
    )
     
    for pelicula in peliculas:
        try:
            titulo = pelicula.find_element(By.CLASS_NAME, 'datalayer-movie').text.strip()
            formatos = pelicula.find_elements(By.CLASS_NAME, 'col3.cf.ng-binding')
            horarios = pelicula.find_elements(By.CLASS_NAME, 'btnhorario')

            formato_text = [formato.text.replace('\n', ' ') for formato in formatos]
            horarios_text = [horario.text.replace('\n', ' ') for horario in horarios]

            for formato, horario in zip(formato_text, horarios_text):
                try:
                    funciones += f'{titulo}|'
                    funciones += f'Cinepolis Limonar|'
                    funciones += f'{formato}|'
                    funciones += f'{horario}|'
                    funciones += f'{url}\n'  

                except: continue  

        except: continue

    driver.quit()
    return funciones

def peliculas_cinemark():
    funciones = ''
    clasificacion_dict = {
        '+ 7': '+ 7 años',
        '+ 12': '+ 12 años',
        '+ 15': '+ 15 años',
        '+ 18': '+ 18 años',
        'TODOS': 'TODOS'
    }

    driver = webdriver.Chrome()
    url = 'https://www.cinemark.com.co/ciudad/cali/pacific-mall'
    driver.get(url)

    peliculas = WebDriverWait(driver, 10).until(
        EC.presence_of_all_elements_located((By.CLASS_NAME, 'section-detail__information-badge'))
    )

    peliculas_info = []  
    enlaces_procesados = set() 

    for pelicula in peliculas:
        try:
            titulo_element = pelicula.find_element(By.CLASS_NAME, 'section-detail__title')
            duracion_element = pelicula.find_element(By.CLASS_NAME, 'clasification--TIME')
            peli = pelicula.text

            titulo = titulo_element.text.strip()
            duracion = duracion_element.text.strip()

            for clasificacion_keyword, clasificacion_value in clasificacion_dict.items():
                if clasificacion_keyword in peli:
                    clasificacion = clasificacion_value
                    break
            else:
                clasificacion = ''

            link = pelicula.find_element(By.TAG_NAME, 'a').get_attribute('href')
            
            # Verificar si el enlace ya se ha procesado
            if titulo not in enlaces_procesados and titulo != '':
                peliculas_info.append((titulo, duracion, clasificacion, link))
                enlaces_procesados.add(titulo)

        except: continue

    for titulo, duracion, clasificacion, link in peliculas_info:
        try:
            driver.get(link)
            time.sleep(3)
            titulo_original = driver.find_element(By.XPATH, "//h4[text()='título original']/following-sibling::p").text
            actores = driver.find_element(By.XPATH, "//h4[text()='reparto']/following-sibling::p").text
            img = driver.find_element(By.XPATH, '//*[@id="__next"]/div[2]/div[2]/div[1]/div[3]/div/div[1]/div/img').get_attribute('src')

            try:
                sinopsis_boton = WebDriverWait(driver, 1).until(
                    EC.element_to_be_clickable((By.XPATH, '//*[@id="__next"]/div[2]/div[2]/div[1]/div[3]/div/p[3]/span[2]'))
                )
                
                if sinopsis_boton:
                    sinopsis_boton.click()

                sinopsis = driver.find_element(By.XPATH, '//*[@id="__next"]/div[2]/div[2]/div[1]/div[3]/div/p[3]/span[1]').text.strip()
            except:
                sinopsis = driver.find_element(By.XPATH, '//*[@id="__next"]/div[2]/div[2]/div[1]/div[3]/div/p[3]/span[1]').text.strip()

            pelicula_format = f"{titulo}|{duracion}|{clasificacion}||Cinemark|{titulo_original}|||{actores}||{img}|{sinopsis}\n"
            funciones += pelicula_format

        except: continue

        driver.get(url)

    driver.quit()
    return funciones

def funciones_cinemark():
    funciones = ""
    driver = webdriver.Chrome()  
    url = 'https://www.cinemark.com.co/ciudad/cali/pacific-mall'

    driver.get(url)

    peliculas = WebDriverWait(driver, 10).until(
        EC.presence_of_all_elements_located((By.CLASS_NAME, 'section-detail__schedule'))
    )
     
    for pelicula in peliculas:
        try:
            titulo = pelicula.find_element(By.CLASS_NAME, 'section-detail__title').text.strip()
            container = pelicula.find_elements(By.CLASS_NAME, 'theater-detail__container--principal__co')
            url = pelicula.find_element(By.TAG_NAME, 'a').get_attribute('href') 

            for contain in container:
                try:
                    formato_elements = contain.find_elements(By.CSS_SELECTOR, ".formats__item")
                    formatos = ' '.join([element.text for element in formato_elements])
                    horarios_elements = contain.find_elements(By.CLASS_NAME, "sessions__button--runtime")
                    horarios = [element.text.replace('[', '').replace(']', '').replace('"', '') for element in horarios_elements]
                    horarios_str = ", ".join(horarios)
                
                    funciones += f'{titulo}|'
                    funciones += f'Cinemark Pacific Mall|'
                    funciones += f'{formatos}|'
                    funciones += f'{horarios_str}|'
                    funciones += f'{url}\n'

                except: continue

        except: continue

    return funciones

def peliculas_izimovie():
    funciones = ""
    funciones_set = set()
    url = 'https://izi.movie'
    peliculas_info = []
    links = []
    driver = webdriver.Chrome()
    driver.get(url)

    peliculas = WebDriverWait(driver, 1).until(
        EC.presence_of_all_elements_located((By.CLASS_NAME, 'movie--time'))
    )

    for pelicula in peliculas:
        try:
            titulo = pelicula.find_element(By.CLASS_NAME, 'movie__title').text.strip()
            duracion = pelicula.find_element(By.CLASS_NAME, 'movie__time').text.strip()
            clasificacion = pelicula.find_element(By.XPATH, ".//span[@class='icon-childcare']/following-sibling::p").text
            generos = pelicula.find_element(By.XPATH, ".//span[@class='icon-theaters']/following-sibling::p").text
            img = pelicula.find_element(By.CLASS_NAME, 'movie-beta__link').find_element(By.TAG_NAME, 'img').get_attribute('src')
            link = pelicula.find_element(By.CLASS_NAME, 'movie__title').get_attribute('href')
            
            links.append(link)

            if titulo not in funciones_set:
                peliculas_info.append((titulo,duracion,clasificacion, generos, img, link))
                funciones_set.add(titulo)

        except: continue

    for titulo, duracion, clasificacion, generos, img, link in peliculas_info:
        try:
            driver.get(link)
            time.sleep(3)
            sinopsis = driver.find_element(By.ID, 'pelicula_sinopsis').text

            pelicula_format = f"{titulo}|{duracion}|{clasificacion}|{generos}|Izimovie||||||{img}|{sinopsis}\n"
            funciones += pelicula_format

            driver.get(url)

        except: continue

    driver.quit()
    return funciones

def funciones_izimovie():
    funciones = ""
    driver = webdriver.Chrome()

    driver.get('https://izi.movie')


    peliculas = WebDriverWait(driver, 1).until(
        EC.presence_of_all_elements_located((By.CLASS_NAME, 'movie--time'))
    )

    for pelicula in peliculas:
        try:
            titulo = pelicula.find_element(By.CLASS_NAME, 'movie__title').text.strip()
            horarios_elements = pelicula.find_elements(By.XPATH, ".//li[@class='time-select__item']")
            horarios = [horario.text.strip() for horario in horarios_elements]
            formato_element = pelicula.find_element(By.XPATH, ".//p[contains(., 'Tipo:')]")
            formato = formato_element.text.split(":")[-1].strip()
            url = pelicula.find_element(By.CLASS_NAME, 'movie__title').get_attribute('href')

            horarios_str = ", ".join(horarios)

            funciones += f'{titulo}|'
            funciones += f'Izimovie Aquarela|'
            funciones += f'{formato}|'    
            funciones += f'{horarios_str}|'    
            funciones += f'{url}\n'  

        except: continue    

    driver.quit()
    return funciones

def peliculas_royalfilms():
    funciones = ""
    funciones_set = set()
    links_peliculas = []
    sinopsis = ""
    url = 'https://royal-films.com/cartelera/cali'
    driver = webdriver.Chrome()
    driver.get(url)

    while True:
        try:
            form = WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.ID, 'form'))
            )

            elemento_select = form.find_element(By.XPATH, '//*[@id="form"]/div/div[2]/select')
            select = Select(elemento_select)
            select.select_by_value('cali')

            elemento_boton = form.find_element(By.XPATH, '//button[@type="submit"]')
            elemento_boton.click()
            break

        except NoSuchElementException:
            pass

    peliculas = WebDriverWait(driver, 10).until(
        EC.presence_of_all_elements_located((By.CLASS_NAME, 'movie-box'))
    )

    for pelicula in peliculas:
        try:
            link = pelicula.get_attribute('href')
            links_peliculas.append(link)

        except: continue

    for link in links_peliculas:
        try:
            driver.get(link)
            
            detalles = WebDriverWait(driver, 10).until(
                EC.element_to_be_clickable((By.XPATH, '//*[@id="movie"]/div/div/div[2]/h2'))
            )

            titulo = detalles.find_element(By.XPATH, '//*[@id="movie"]/div/div/div[2]/h2').text.strip()
            duracion = detalles.find_element(By.XPATH, '/html/body/app-root/div[2]/app-movie/section[2]/div/div/div[2]/div/div[1]/ul[1]/li[2]').text.strip()
            clasificacion = detalles.find_element(By.XPATH, '/html/body/app-root/div[2]/app-movie/section[2]/div/div/div[2]/div/div[1]/ul[2]/li[last()]').text.strip()
            generos_element = detalles.find_elements(By.XPATH, '/html/body/app-root/div[2]/app-movie/section[2]/div/div/div[2]/div/div[1]/ul[2]/li[position() < last()]')
            generos = [genero.text.strip() for genero in generos_element]

            generos_str = ', '.join(generos)
            
            try:
                sinopsis_boton = WebDriverWait(driver, 1).until(
                    EC.element_to_be_clickable((By.XPATH, '//*[@id="movie"]/div/div/div[2]/div/div[2]/p/a'))
                )
                
                if sinopsis_boton:
                    sinopsis_boton.click()

                sinopsis = detalles.find_element(By.XPATH, '//*[@id="movie"]/div/div/div[2]/div/div[2]/p').text.strip()
            except:
                sinopsis = detalles.find_element(By.XPATH, '//*[@id="movie"]/div/div/div[2]/div/div[2]/p').text.strip()
            
            titulo_original = detalles.find_element(By.XPATH, '//*[@id="movie"]/div/div/div[2]/div/div[2]/table/tbody/tr[2]/td').text.strip()
            director = detalles.find_element(By.XPATH,'//*[@id="movie"]/div/div/div[2]/div/div[2]/table/tbody/tr[4]/td').text.strip()
            actores_elements = detalles.find_elements(By.XPATH, '//*[@id="movie"]/div/div/div[2]/div/div[2]/table/tbody/tr[3]/td')
            actores = [actor.text.strip() for actor in actores_elements]
            actores_str = ', '.join(actores)
            img_element = driver.find_element(By.XPATH, '//*[@id="movie"]/div/div/div[1]/div/span').get_attribute('style')

            start_index = img_element.find('url("') + len('url("')
            end_index = img_element.find('")', start_index)
            img = img_element[start_index:end_index]

            if titulo not in funciones_set:

                funciones += f'{titulo}|'
                funciones += f'{duracion}|'
                funciones +=  f'{clasificacion}|'
                funciones += f'{generos_str}|'
                funciones += f'Royalfilms|'
                funciones += f'{titulo_original}|'
                funciones += f'|'
                funciones += f'{director}|'
                funciones += f'{actores_str}|'
                funciones += f'|'
                funciones += f'{img}|'
                funciones += f'{sinopsis}\n'

                funciones_set.add(titulo)

        except: continue
        
        driver.back()

    driver.quit()
    return funciones

def funciones_royalfilms():
    funciones = ""
    links_peliculas = []

    driver = webdriver.Chrome()

    url = 'https://royal-films.com/cartelera/cali'

    driver.get(url)

    while True:
        try:
            form = WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.ID, 'form'))
            )

            elemento_select = form.find_element(By.XPATH, '//*[@id="form"]/div/div[2]/select')
            select = Select(elemento_select)
            select.select_by_value('cali')

            elemento_boton = form.find_element(By.XPATH, '//button[@type="submit"]')
            elemento_boton.click()
            break

        except NoSuchElementException:
            pass

    peliculas = WebDriverWait(driver, 10).until(
        EC.presence_of_all_elements_located((By.CLASS_NAME, 'movie-box'))
    )

    for pelicula in peliculas:
        try:
            time.sleep(2)
            link = pelicula.get_attribute('href')
            links_peliculas.append(link)

        except: continue

    for link in links_peliculas:
        try:
            driver.get(link)
            time.sleep(5)
        
            titulo = driver.find_element(By.XPATH, '//*[@id="movie"]/div/div/div[2]/h2')
            driver.execute_script("window.scrollBy(0, 500);")

            for i in range(1, 5):  
                ul_xpath = f'//*[@id="movie"]/div/div/div[2]/div/div[3]/div[3]/ul[{i}]'
                
                try:
                    element_click = driver.find_element(By.XPATH, f'{ul_xpath}/li[1]/span')
                    element_click.click()

                except:
                    continue

                time.sleep(1)

                sala_nombre = driver.find_element(By.XPATH, f'{ul_xpath}//li[1]/span').text.strip()

                formatos_horarios = WebDriverWait(driver, 10).until(
                    EC.presence_of_all_elements_located((By.XPATH, f'{ul_xpath}//li[@class="row"]'))
                )

                for data in formatos_horarios:
                    try:
                        formato = data.find_element(By.XPATH, 'span[1]').text
                        horarios_elements = data.find_elements(By.XPATH, 'span[2]/a')

                        horarios = [horario.text for horario in horarios_elements]
                        horarios_str = ', '.join(horarios)

                        funciones += f'{titulo.text}|'
                        funciones += f'Royal films {sala_nombre}|'
                        funciones += f'{formato}|'
                        funciones += f'{horarios_str}|'
                        funciones += f'{link}\n'

                    except: continue

        except: continue

        driver.get(url)

    driver.quit()
    return funciones

pelis_cinecolombia = peliculas_cinecolombia()
pelis_cinepolis = peliculas_cinepolis()
pelis_cinemark = peliculas_cinemark()
pelis_izimovie = peliculas_izimovie()
pelis_royalfilms = peliculas_royalfilms()

with open("./python/peliculas.txt","w", encoding="UTF-8") as archivo:
    archivo.write(pelis_cinecolombia)
    archivo.write(pelis_cinepolis)
    archivo.write(pelis_cinemark)
    archivo.write(pelis_izimovie.strip())
    archivo.write(pelis_royalfilms.strip())

# func_cinecolombia = funciones_cinecolombia()
# func_cinepolis = funciones_cinepolis()
# func_cinemark = funciones_cinemark()
# func_izimovie = funciones_izimovie()
# func_royalfilms = funciones_royalfilms()

# with open('./python/funciones2.txt', 'w', encoding='UTF-8') as archivo:
    # archivo.write(func_cinecolombia)
    # archivo.write(func_cinepolis)
    # archivo.write(func_cinemark)
    # archivo.write(func_izimovie)
    # archivo.write(func_royalfilms)
