from bs4 import BeautifulSoup
from pathlib import Path

def extract_directories():
    root = Path("..")
    html_folder = root/"HTML"
    pages_folder = root/"Pages"
    return root, html_folder, pages_folder

def load_routes(file_path):
    routes = {}

    with open(file_path, "r", encoding="utf-8") as file:
        for line in file:
            line = line.strip()
            if not line:
                continue

            old, new = line.split("=")
            routes[old] = new
    return routes

def html_link_replacer(html, routes):
    for old, new in routes.items():

        if old in html:
            print(f'HTML: "{old}" -> "{new}"')
            html = html.replace(old, new)

    return html

def css_replacer(soup, root):
    css_links = soup.find_all("link", rel="stylesheet")

    for css in css_links:
        css_path = root / css["href"].lstrip("/")
        css_text = css_path.read_text(encoding="utf-8-sig")

        print("CSS: working on: " + css_path.name)
        style_tag = soup.new_tag("style")
        style_tag["data-file"] = css_path.name
        style_tag.string = css_text

        css.replace_with(style_tag)

def js_replacer(soup, root):
    js_scripts = soup.find_all("script", src=True)

    for script in js_scripts:
        # Skip for google tag manager
        if script.has_attr("data-no-inline"):
            print("JS: skipping external script:", script["src"])
            continue

        js_path = root / script["src"].lstrip("/")
        js_text = js_path.read_text(encoding="utf-8")

        print("JS: working on:", js_path.name)
        new_script = soup.new_tag("script")
        new_script["data-file"] = js_path.name
        new_script.string = js_text

        script.replace_with(new_script)

def svg_replacer():
    ...

def save(root, output_folder, file):
    output_folder.mkdir(exist_ok=True)

    if file.name == "index.html":
        output_file = root / file.name
    else:
        output_file = output_folder / file.name

    output_file.write_text(soup.prettify(), encoding="utf-8")

if __name__=="__main__":
    # Extracting Directoreis
    root, html_folder, pages_folder = extract_directories()

    # Extracting roats map
    routes = load_routes("../routes.map")
    
    # Extracting HTML text
    html_files_list = list()
    for file in html_folder.iterdir():
        if file.suffix == ".html":
            html_files_list.append(file)

    # Replacing CSS, JS, SVG
    for file in html_files_list:
        print("----------------------- working on: " + str(file.name))
        html = file.read_text(encoding="utf-8")
        html = html_link_replacer(html, routes)
        soup = BeautifulSoup(html, "html.parser")

        css_replacer(soup, root)
        js_replacer(soup, root)
  
        save(root, pages_folder, file)
        
    print("---------------------------------------")
    print("Build Successfully Done!")
