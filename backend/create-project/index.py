import json
import os
import psycopg2
from psycopg2.extras import Json
from typing import Dict, Any
import uuid

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Create new website project configuration
    Args: event - dict with httpMethod, body containing project details
          context - object with request_id, function_name
    Returns: HTTP response with project_id and preview URL
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Session-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    body_data = json.loads(event.get('body', '{}'))
    
    session_id = event.get('headers', {}).get('X-Session-Id') or str(uuid.uuid4())
    title = body_data.get('title', 'Новый проект')
    description = body_data.get('description', '')
    style = body_data.get('style', 'modern')
    sections = body_data.get('sections', 'home,about,contact')
    colors = body_data.get('colors', {})
    
    html_content = generate_html(title, description, style, sections, colors)
    
    dsn = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(dsn)
    cur = conn.cursor()
    
    cur.execute('''
        INSERT INTO projects (session_id, title, description, style, sections, colors, html_content)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        RETURNING id
    ''', (session_id, title, description, style, sections, Json(colors), html_content))
    
    project_id = cur.fetchone()[0]
    conn.commit()
    
    cur.close()
    conn.close()
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({
            'project_id': project_id,
            'session_id': session_id,
            'preview_url': f'/preview/{project_id}',
            'message': 'Проект создан успешно!'
        })
    }

def generate_html(title: str, description: str, style: str, sections: str, colors: dict) -> str:
    primary_color = colors.get('primary', '#9b87f5')
    secondary_color = colors.get('secondary', '#6E59A5')
    
    sections_list = sections.split(',')
    sections_html = ''
    
    if 'home' in sections_list:
        sections_html += f'''
        <section class="hero">
            <h1>{title}</h1>
            <p>{description}</p>
            <button>Начать</button>
        </section>
        '''
    
    if 'about' in sections_list:
        sections_html += '''
        <section class="about">
            <h2>О нас</h2>
            <p>Расскажем о нашей компании и миссии.</p>
        </section>
        '''
    
    if 'contact' in sections_list:
        sections_html += '''
        <section class="contact">
            <h2>Контакты</h2>
            <p>Email: info@example.com</p>
            <p>Телефон: +7 (999) 123-45-67</p>
        </section>
        '''
    
    html = f'''
    <!DOCTYPE html>
    <html lang="ru">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>{title}</title>
        <style>
            * {{ margin: 0; padding: 0; box-sizing: border-box; }}
            body {{ font-family: 'Inter', -apple-system, sans-serif; line-height: 1.6; color: #333; }}
            .hero {{ 
                min-height: 100vh; 
                display: flex; 
                flex-direction: column; 
                justify-content: center; 
                align-items: center; 
                background: linear-gradient(135deg, {primary_color} 0%, {secondary_color} 100%);
                color: white;
                text-align: center;
                padding: 2rem;
            }}
            .hero h1 {{ font-size: 3rem; margin-bottom: 1rem; font-weight: 700; }}
            .hero p {{ font-size: 1.5rem; margin-bottom: 2rem; opacity: 0.9; }}
            .hero button {{ 
                padding: 1rem 2rem; 
                font-size: 1.2rem; 
                background: white; 
                color: {primary_color}; 
                border: none; 
                border-radius: 8px; 
                cursor: pointer;
                font-weight: 600;
                transition: transform 0.2s;
            }}
            .hero button:hover {{ transform: scale(1.05); }}
            section {{ padding: 4rem 2rem; max-width: 1200px; margin: 0 auto; }}
            section h2 {{ font-size: 2.5rem; margin-bottom: 1.5rem; color: {primary_color}; }}
            section p {{ font-size: 1.2rem; color: #666; margin-bottom: 1rem; }}
            .about {{ background: #f9f9f9; }}
            .contact {{ text-align: center; }}
        </style>
    </head>
    <body>
        {sections_html}
    </body>
    </html>
    '''
    return html
