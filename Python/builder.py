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
            print(f'HTML: Replace Link "{old}" -> "{new}"')
            html = html.replace(old, new)

    return html

def add_onerror_to_images(soup):
    """
    Add onerror attribute to all img tags in a BeautifulSoup object (in place).

    The onerror attribute hides the image if it fails to load:
        onerror="this.style.display='none'"

    Args:
        soup (BeautifulSoup): A parsed BeautifulSoup object to modify.
            The object is mutated in place.

    Returns:
        None: The soup object is modified directly; no value is returned.
    """
    for img in soup.find_all('img'):
        img['onerror'] = "this.style.display='none'"
        print("HTML: add onerror='none' on:", img.get('src'))

def css_replacer(soup, root):
    css_links = soup.find_all("link", rel="stylesheet")

    for css in css_links:
        href = css.get("href")
        if href.startswith("http://") or href.startswith("https://"):
            print("CSS: adding:", href)
            continue

        css_path = root / css["href"].lstrip("/")
        css_text = css_path.read_text(encoding="utf-8-sig")

        print("CSS: Merging with html: " + css_path.name)
        style_tag = soup.new_tag("style")
        style_tag["data-file"] = css_path.name
        style_tag.string = css_text

        css.replace_with(style_tag)

def js_replacer(soup, root):
    js_scripts = soup.find_all("script", src=True)

    for script in js_scripts:
        # Skip scripts explicitly marked as "don't inline"
        if script.has_attr("data-no-inline"):
            print("JS: skipping external script:", script["src"])
            continue

        js_path = root / script["src"].lstrip("/")
        js_text = js_path.read_text(encoding="utf-8")

        print("JS: Merging with html:", js_path.name)
        new_script = soup.new_tag("script")

        # Preserve all attributes from the original tag
        for attr, value in script.attrs.items():
            new_script[attr] = value

        # Inlining replaces src; keep the original file name for reference
        del new_script["src"]
        new_script["data-file"] = js_path.name
        new_script.string = js_text

        script.replace_with(new_script)

def svg_replacer():
    ...

def save(root, routes, file):
    """
    Write a processed HTML file to its destination path defined in routes.map.

    The destination is looked up from the routes mapping using the source key
    "/HTML/<file.name>". This makes routes.map the single source of truth for
    output locations, so a route such as "/HTML/404.html=/404.html" is written
    to the project root, while "/HTML/about.html=/Pages/about.html" is written
    into the Pages folder.

    Any missing parent directories (e.g. /Pages/) are created automatically.

    Args:
        root (Path): The project root directory; destination paths are
            resolved relative to it.
        routes (dict[str, str]): Mapping of source keys (e.g. "/HTML/404.html")
            to destination routes (e.g. "/404.html" or "/Pages/about.html"),
            as loaded from routes.map.
        file (Path): The source HTML file to save. Its name is used to build
            the lookup key "/HTML/<file.name>" in routes.
        soup (BeautifulSoup): The parsed and processed HTML document to
            serialize. Its prettified form is written to disk.

    Returns:
        None: The file is written to disk; no value is returned.

    Raises:
        KeyError: If no route exists in routes for "/HTML/<file.name>".
    """
    source_key = f"/HTML/{file.name}"

    if source_key not in routes:
        raise KeyError(
            f"No route found for {file.name} (looked up {source_key!r} in routes.map)"
        )

    relative_output = routes[source_key].lstrip("/")
    output_file = root / relative_output
    output_file.parent.mkdir(parents=True, exist_ok=True)

    print(f"HTML: saving {file.name} -> {output_file}")
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

        add_onerror_to_images(soup)
        css_replacer(soup, root)
        js_replacer(soup, root)
  
        save(root, routes, file)
        
    print("---------------------------------------")
    print("Build Successfully Done!")
