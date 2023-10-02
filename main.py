import requests
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def cinecolombia():
    #variable que guarda las funciones de cine
    funciones = ""
    #Variable set para no repetir funciones de cine
    funciones_set = set()
    
    url = 'https://www.cinecolombia.com/cali'

    #Realizar una solicitud HTTP para obtener el contenido de la página
    response = requests.get(url)

    # Verificar si la solicitud fue exitosa (código de estado 200)
    if response.status_code == 200:
        # Parsear el contenido HTML de la página
        soup = BeautifulSoup(response.text, 'html.parser')

        peliculas = soup.find_all('a', class_='movie-item')
        
        for pelicula in peliculas:

            titulo = pelicula.find('h2', class_='movie-item__title').text.strip()
            metas = pelicula.find_all('span', class_='movie-item__meta')
            tags = pelicula.find_all('span', class_='tag')

            fecha_estreno = ""
            titulo_espanol = ""
            generos = []
            duracion = ""
            publico_recomendado = ""

            for meta in metas:
                texto = meta.text.strip()
                if "Estreno:" in texto:
                    fecha_estreno = texto.replace("Estreno:", "").strip()
                elif "Título en español:" in texto:
                    titulo_espanol = texto.replace("Título en español:", "").strip()
                elif "Género:" in texto:
                    generos.extend([g.strip() for g in texto.replace("Género:", "").split(',')])

            for tag in tags:
                texto = tag.text.strip()
                if "Min" in texto:
                    duracion = texto.strip()
                elif "Recomendada" or "Para" or "Exclusiva" in texto:
                    publico_recomendado = texto.strip()
                
            #añadir funciones al string
            if titulo not in funciones_set:
                funciones += (f'Título: {titulo}\n')
                funciones += (f'Título en español: {titulo_espanol}\n')
                funciones += (f'Fecha de Estreno: {fecha_estreno}\n')
                funciones += (f'Géneros: {", ".join(generos)}\n')
                funciones += (f'Duración: {duracion}\n')
                funciones += (f'Público Recomendado: {publico_recomendado}\n')
                funciones += ('-' * 50 + '\n')  # Separador entre películas

                funciones_set.add(titulo)
    else:
        print('La solicitud al sitio web del cine no fue exitosa.')

    return funciones

def cinepolis():
    funciones = ""
    funciones_set = set()

    driver = webdriver.Chrome()  

    url = 'https://cinepolis.com.co/cartelera/cali-colombia'

    driver.get(url)

    try:    
        peliculas = WebDriverWait(driver, 10).until(
            EC.presence_of_all_elements_located((By.CLASS_NAME, 'tituloPelicula'))
        )

        for pelicula in peliculas:
            titulo = pelicula.find_element(By.CLASS_NAME, 'datalayer-movie').text.strip()
            duracion = pelicula.find_element(By.CLASS_NAME, 'duracion').text.strip()
            rating = pelicula.find_element(By.CLASS_NAME, 'clasificacion').text.strip()

            if titulo not in funciones_set:

                funciones +=(f'Título de la película: {titulo}\n')
                funciones +=(f'Duración: {duracion}\n')
                funciones +=(f'Clasificación: {rating}\n')
                funciones +=('-' * 50 + '\n')  # Separador entre películas

                funciones_set.add(titulo)

    except Exception as e:
        print()

    driver.quit()
    return funciones

def cinemark():

    funciones = ""
    funciones_set = set()

    driver = webdriver.Chrome()

    url = 'https://www.cinemark.com.co/ciudad/cali/pacific-mall'

    driver.get(url)

    try:
        peliculas = WebDriverWait(driver, 10).until(
            EC.presence_of_all_elements_located((By.CLASS_NAME, 'list-movies'))
        )

        for pelicula in peliculas:

            titulo = pelicula.find_element(By.CLASS_NAME, 'section-detail__title').text.strip()
            duracion = pelicula.find_element(By.CLASS_NAME, 'clasification--TIME').text.strip()

            if titulo not in funciones_set:

                funciones += f'Título de la película: {titulo}\n'
                funciones += f'Duración: {duracion}\n'
                funciones += '-' * 50 + '\n'  # Separador entre películas

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
            EC.presence_of_all_elements_located((By.CLASS_NAME, 'row'))
        )

        print(peliculas)

        for pelicula in peliculas:

            titulo = pelicula.find_element(By.CLASS_NAME, 'movie__title').text.strip()
            duracion = pelicula.find_element(By.CLASS_NAME, 'movie__time').text.strip()

            if titulo not in funciones_set:

                funciones +=(f'Título de la película: {titulo}\n')
                funciones +=(f'Duración: {duracion}\n')
                funciones +=('-' * 50 + '\n')  # Separador entre películas

                funciones_set.add(titulo)
    except Exception as e:
        print()

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

                funciones +=(f'Título de la película: {titulo}\n')
                funciones +=(f'Género: {genero}\n')
                funciones +=('-' * 50 + '\n')  # Separador entre películas

                funciones_set.add(titulo)
                
    except Exception as e:
        print()

    # Cierra el controlador de Selenium
    driver.quit()
    return funciones


# peliculas_cinepolis = cinepolis()
# print(peliculas_cinepolis)

# peliculas_cinecolombia = cinecolombia()
# print(peliculas_cinecolombia)

# peliculas_cinemark = cinemark()
# print(peliculas_cinemark)

# peliculas_izimovie = izimovie()
# print(peliculas_izimovie)

# peliculas_royalfilms = royalfilms()
# print(peliculas_royalfilms)









