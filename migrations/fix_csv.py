# fix the linkedin_urls1-100.csv file. header row is linkedin_url
# some of the urls are like //linkedin.com/in/sekou-calliste-85162626 and missing https:


import csv
import os


def fix_csv():
    with open("linkedin_urls1-100.csv", mode="r") as file:
        reader = csv.reader(file)
        rows = list(reader)
        for i, row in enumerate(rows):
            if i == 0:
                continue
            url = row[0]
            if url.startswith("//"):
                rows[i][0] = f"https:{url}"
    with open("linkedin_urls1-100.csv", mode="w") as file:
        writer = csv.writer(file)
        writer.writerows(rows)


if __name__ == "__main__":
    fix_csv()