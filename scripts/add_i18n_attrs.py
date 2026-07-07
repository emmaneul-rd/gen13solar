#!/usr/bin/env python3
"""
Gen 13 Solar — Automated data-i18n attribute adder.

Reads en.json keys and adds data-i18n attributes to HTML files.
Preserves HTML structure (keeps <span>, <br>, etc. inside elements).
"""

import json
import re
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LOCALES_DIR = os.path.join(BASE_DIR, 'locales')
HTML_FILES = [
    'index.html',
    'about.html',
    'services.html',
    'projects.html',
    'contact.html',
    'privacy.html',
    'terms.html',
    '404.html',
    'thank-you.html',
]

def load_translations():
    """Load en.json to get all translation keys."""
    en_path = os.path.join(LOCALES_DIR, 'en.json')
    with open(en_path, 'r', encoding='utf-8') as f:
        return json.load(f)

def escape_for_html(text):
    """Escape special characters for HTML matching."""
    return text.replace('&', '&').replace('<', '<').replace('>', '>')

def add_i18n_to_file(filepath, translations):
    """Add data-i18n attributes to an HTML file."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content
    keys_added = []

    # Sort keys by length (longest first) to avoid partial matches
    sorted_keys = sorted(translations.keys(), key=lambda k: len(translations[k]), reverse=True)

    for key in sorted_keys:
        en_text = translations[key]
        if not en_text or len(en_text) < 3:
            continue

        # Skip keys with HTML tags in the value (handle separately)
        if '<' in en_text and '>' in en_text:
            continue

        # Escape for regex
        escaped = re.escape(en_text)
        # Replace whitespace (including newlines) with flexible match
        escaped_flex = re.sub(r'\s+', r'\s+', escaped)

        # Pattern: text not already inside a data-i18n attribute
        # Looks for the text in HTML content
        pattern = r'(?<!<[^>]*data-i18n[^>]*>)(?<![>])\s*' + escaped_flex + r'\s*(?![^<]*</[^>]*>)'

        # Try to find and replace
        match = re.search(escaped_flex, content, re.DOTALL)
        if match:
            matched_text = match.group(0).strip()
            # Check if this text is already inside a data-i18n element
            # Simple heuristic: if the text is between > and <, it's likely element content
            replacement = f'<span data-i18n="{key}">{matched_text}</span>'
            content = content.replace(matched_text, replacement, 1)
            keys_added.append(key)

    # Now handle special cases (FAQ questions, process steps, etc.)
    # These need manual review, so we'll just log them

    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'  Updated: {os.path.basename(filepath)} ({len(keys_added)} keys added)')
        return True, keys_added
    else:
        print(f'  No changes: {os.path.basename(filepath)}')
        return False, []

if __name__ == '__main__':
    print('Gen 13 Solar — Adding data-i18n attributes...')
    print('=' * 50)

    translations = load_translations()
    print(f'Loaded {len(translations)} translation keys from en.json')
    print('-' * 50)

    for html_file in HTML_FILES:
        filepath = os.path.join(BASE_DIR, html_file)
        if not os.path.exists(filepath):
            print(f'  SKIP: {html_file} (not found)')
            continue
        add_i18n_to_file(filepath, translations)

    print('-' * 50)
    print('Done! Review changes and manually fix any issues.')
    print('NOTE: This script uses a simple approach. Manual review recommended.')
