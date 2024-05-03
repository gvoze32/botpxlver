import requests
from bs4 import BeautifulSoup
import time

url = "https://generator.email/"

with open("domains.txt", "a") as file:
    for i in range(100):
        response = requests.get(url)
        soup = BeautifulSoup(response.content, "html.parser")
        div_list = soup.find("div", class_="tt-dataset-typeahead_as3gsdr")
        domains = [p.text for p in div_list.find_all("p")]
        for domain in domains:
            file.write(domain + "\n")
        time.sleep(5)

with open("domains.txt", "r") as file:
    lines = file.readlines()
    unique_lines = list(set(lines))

with open("domains.txt", "w") as file:
    file.writelines(unique_lines)

print(f"Total domain unik: {len(unique_lines)}")
