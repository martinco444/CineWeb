import requests
import pandas as pd
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

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
                funciones += f'{sinopsis}|'
                funciones += f'{titulo_original}|'
                funciones += f'{pais_origen}|'
                funciones += f'{director}|'
                funciones += f'{actores}|'
                funciones += f'{idioma}\n'

                funciones_set.add(titulo)
    else:
        print('La solicitud al sitio web del cine no fue exitosa.')

    return funciones

def funciones_cinecolombia():
    funciones = ""
    url = 'https://www.cinecolombia.com/cali/cartelera'

    driver = webdriver.Chrome()

    driver.get(url)

    peliculas = WebDriverWait(driver, 10).until(
        EC.presence_of_all_elements_located((By.CLASS_NAME, 'movie-item'))
    )

    for pelicula in peliculas:
        try:
            enlace_pelicula = pelicula.get_attribute('href')
            driver.get(enlace_pelicula)

            # Obtener el título de la película
            titulo = driver.find_element(By.CLASS_NAME, 'ezstring-field').text

            # Buscar todos los elementos que representan salas de cine
            salas = driver.find_elements(By.CLASS_NAME, 'show-times-collapse__title')

            for sala in salas:
                sala_nombre = sala.text.strip()
                sala.click()

                # Esperar a que aparezcan los horarios (ajusta el selector según sea necesario)
                horarios_element = WebDriverWait(driver, 20).until(
                    EC.presence_of_all_elements_located((By.CLASS_NAME, 'show-times-group__times'))
                )

                # Buscar los elementos <span> dentro del <div> con clase 'show-times-group__attrs'
                formatos_element = WebDriverWait(driver, 20).until(
                    EC.presence_of_all_elements_located((By.CLASS_NAME, 'show-times-group__attrs'))
                )

                # Filtrar los elementos no vacíos en las listas de formatos y horarios
                horarios = [horario.text.replace('\n', ', ') for horario in horarios_element if horario.text.strip() != '']
                formatos = [formato.text.replace('\n', ' ') for formato in formatos_element if formato.text.strip()]

                # Imprimir la información para cada sala
                for formato, horario in zip(formatos, horarios):
                    funciones += f'{titulo}|'
                    funciones += f'{sala_nombre}|'
                    funciones += f'{formato}|'
                    funciones += f'{horario}|'
                    funciones += f'{enlace_pelicula}\n'

        except Exception as e:
            print(f"No se pudo encontrar horarios: {e}")

        driver.back()

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
            actores = ', '.join(datos_pelicula.get_attribute('data-actor').replace('"', '').replace('[', '').replace(']', '').split(', '))
            titulo_original = datos_pelicula.get_attribute('data-titulooriginal')

            funciones += f'{titulo}|'
            funciones += f'{duracion}|'
            funciones += f'{clasificacion}|'
            funciones += f'{generos}|'
            funciones += f'Cinepolis|'
            funciones += f'|'   #sinopsis
            funciones += f'{titulo_original}'
            funciones += f'|'   #pais de origen
            funciones += f'{director}|'
            funciones += f'{actores}|'
            funciones += f'|\n'   #idioma

        except:
            print()

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

                funciones += f'{titulo}|'
                funciones += f'Cinepolis limonar|'
                funciones += f'{formato}|'
                funciones += f'{horario}|'
                funciones += f'{url}\n'    

        except Exception as e:
            print(e)

    driver.quit()
    return funciones

def cinemark():
    driver = webdriver.Chrome()

    url = 'https://www.cinemark.com.co/ciudad/cali/pacific-mall'

    driver.get(url)

    clasificacion_dict = {
        '+ 7': '+ 7 años',
        '+ 12': '+ 12 años',
        '+ 15': '+ 15 años',
        '+ 18': '+ 18 años',
        'TODOS': 'TODOS'
    }

    funciones = ""
    funciones_set = set()

    try:
        peliculas = WebDriverWait(driver, 10).until(
            EC.presence_of_all_elements_located((By.CLASS_NAME, 'section-detail__information-badge'))
        )

        for pelicula in peliculas:
            titulo = pelicula.find_element(By.CLASS_NAME, 'section-detail__title').text.strip()
            duracion = pelicula.find_element(By.CLASS_NAME, 'clasification--TIME').text.strip()
            peli = pelicula.text

            for clasificacion_keyword, clasificacion_value in clasificacion_dict.items():
                if clasificacion_keyword in peli:
                    clasificacion = clasificacion_value
                    break
            else:
                clasificacion = ''

            if titulo not in funciones_set and titulo != "":
                funciones += f'{titulo}; {duracion}; {clasificacion}; ; Cinemark\n'
                funciones_set.add(titulo)

    except Exception as e:
        print(f'Error: {e}')

    driver.quit()
    
    return funciones


def izimovie():
    funciones = ""
    funciones_set = set()

    driver = webdriver.Chrome()

    driver.get('https://izi.movie')

    try:
        peliculas = WebDriverWait(driver, 1).until(
            EC.presence_of_all_elements_located((By.CLASS_NAME, 'movie--time'))
        )

        for pelicula in peliculas:

            titulo = pelicula.find_element(By.CLASS_NAME, 'movie__title').text.strip()
            duracion = pelicula.find_element(By.CLASS_NAME, 'movie__time').text.strip()

            if titulo not in funciones_set:

                funciones +=(f'{titulo}; ')
                funciones +=(f'{duracion}; ')
                funciones += '; '  
                funciones += '; '
                funciones += 'Izimovie\n'

                funciones_set.add(titulo)
    except Exception as e:
        print(f'Error: {e}')

    driver.quit()
    return funciones

def royalfilms():

    funciones = ""
    funciones_set = set()

    driver = webdriver.Chrome()

    driver.get('https://royal-films.com/informacion/cali/teatro/12/multicine-jardin-plaza-cali/cartelera')

    try:
        peliculas = WebDriverWait(driver, 10).until(
            EC.presence_of_all_elements_located((By.CLASS_NAME, 'info'))
        )

        for pelicula in peliculas:

            titulo = pelicula.find_element(By.TAG_NAME, 'h3').text.strip()
            genero = pelicula.find_element(By.TAG_NAME, 'small').text.strip()

            if titulo not in funciones_set:

                funciones +=(f'{titulo}; ')
                funciones += '; '
                funciones += '; '
                funciones +=(f'{genero}; ')
                funciones +=('Royalfilms\n')  

                funciones_set.add(titulo)
                
    except Exception as e:
        print(f'Error: {e}')

    driver.quit()
    return funciones


pelis_cinecolombia = peliculas_cinecolombia()
cinepolis = peliculas_cinepolis()
# # peliculas_cinemark = cinemark()
# # peliculas_izimovie = izimovie()
# # peliculas_royalfilms = royalfilms()

with open("./python/peliculas.txt","w", encoding="UTF-8") as archivo:
    archivo.write(pelis_cinecolombia)
    archivo.write(cinepolis)
    # archivo.write(peliculas_cinemark)
    # archivo.write(peliculas_izimovie)
    # archivo.write(peliculas_royalfilms)

cineco = funciones_cinecolombia()
cinepolis = funciones_cinepolis()

with open('./python/funciones.txt', 'w', encoding='UTF-8') as archivo:
    archivo.write(cineco)






