import re
import sys

def multiply_fonts_by_3(css_content):
    # Regex to find CSS blocks
    blocks = re.findall(r'([^{]+)\s*\{([^}]*)\}', css_content)
    new_css = ""
    
    last_end = 0
    pattern = re.compile(r'([^{]+)\s*\{([^}]*)\}')
    
    for match in pattern.finditer(css_content):
        start, end = match.span()
        new_css += css_content[last_end:start]
        
        selector = match.group(1)
        body = match.group(2)
        
        if '.sb-' in selector:
            # Multiply font-sizes inside this block
            def sub_font_size(m):
                val = float(m.group(1))
                return f"font-size: {int(val * 3)}px"
            
            new_body = re.sub(r'font-size:\s*([\d\.]+)px', sub_font_size, body)
            new_css += f"{selector} {{{new_body}}}"
        else:
            new_css += css_content[start:end]
            
        last_end = end
        
    new_css += css_content[last_end:]
    return new_css

if __name__ == '__main__':
    with open('style.css', 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_content = multiply_fonts_by_3(content)
    
    with open('style.css', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Done")
