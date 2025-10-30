import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Get project by ID or session
    Args: event - dict with httpMethod, queryStringParameters
          context - object with request_id
    Returns: HTTP response with project data
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Session-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    params = event.get('queryStringParameters', {})
    project_id = params.get('id')
    session_id = params.get('session_id')
    
    if not project_id and not session_id:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'project_id or session_id required'})
        }
    
    dsn = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(dsn)
    cur = conn.cursor()
    
    if project_id:
        cur.execute('''
            SELECT id, session_id, title, description, style, sections, colors, html_content, created_at
            FROM projects
            WHERE id = %s
        ''', (project_id,))
    else:
        cur.execute('''
            SELECT id, session_id, title, description, style, sections, colors, html_content, created_at
            FROM projects
            WHERE session_id = %s
            ORDER BY created_at DESC
            LIMIT 10
        ''', (session_id,))
    
    rows = cur.fetchall()
    cur.close()
    conn.close()
    
    if not rows:
        return {
            'statusCode': 404,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Project not found'})
        }
    
    if project_id:
        row = rows[0]
        project = {
            'id': row[0],
            'session_id': row[1],
            'title': row[2],
            'description': row[3],
            'style': row[4],
            'sections': row[5],
            'colors': row[6],
            'html_content': row[7],
            'created_at': row[8].isoformat()
        }
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps(project)
        }
    else:
        projects = []
        for row in rows:
            projects.append({
                'id': row[0],
                'session_id': row[1],
                'title': row[2],
                'description': row[3],
                'style': row[4],
                'sections': row[5],
                'colors': row[6],
                'created_at': row[8].isoformat()
            })
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'projects': projects})
        }
