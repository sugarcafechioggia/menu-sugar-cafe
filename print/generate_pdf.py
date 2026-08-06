#!/usr/bin/env python3
import json, re, subprocess
from pathlib import Path
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_RIGHT
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import BaseDocTemplate, Frame, PageTemplate, Paragraph, Spacer, Image, PageBreak, NextPageTemplate, Table, TableStyle, KeepTogether, HRFlowable

ROOT = Path(__file__).resolve().parents[1]
HERE = Path(__file__).resolve().parent
ASSETS = HERE / 'assets'
OUTPUT = ROOT / 'menu-sugar-cafe-a4-2-colonne.pdf'
RED, INK, MUTED, LINE, PAPER = map(colors.HexColor, ['#E30613','#111111','#716B64','#D8D0C4','#F4EFE6'])

def refresh_translations():
    try: subprocess.run(['node',str(HERE/'export-translations.cjs')],check=True,capture_output=True)
    except (FileNotFoundError,subprocess.CalledProcessError):
        if not (HERE/'translations.json').exists(): raise RuntimeError('Node.js non disponibile e translations.json mancante')

refresh_translations()
menu=json.loads((ROOT/'menu.json').read_text(encoding='utf-8'))
translations=json.loads((HERE/'translations.json').read_text(encoding='utf-8'))

for name,file in [('Barlow600','barlow-condensed-600.ttf'),('Barlow700','barlow-condensed-700.ttf'),('Barlow800','barlow-condensed-800.ttf'),('Inter400','inter-400.ttf'),('Inter500','inter-500.ttf'),('Inter600','inter-600.ttf'),('Inter700','inter-700.ttf')]:
    pdfmetrics.registerFont(TTFont(name,str(ASSETS/file)))

base=getSampleStyleSheet()
cover_title=ParagraphStyle('cover',parent=base['Heading1'],fontName='Barlow700',fontSize=21,leading=24,alignment=TA_CENTER,textColor=INK)
cover_sub=ParagraphStyle('coversub',parent=base['Normal'],fontName='Inter500',fontSize=11,leading=14,alignment=TA_CENTER,textColor=MUTED)
allergen_title=ParagraphStyle('at',parent=base['Heading1'],fontName='Barlow700',fontSize=34,leading=36,alignment=TA_CENTER,textColor=RED,spaceAfter=7*mm)
category_title=ParagraphStyle('ct',parent=base['Heading1'],fontName='Barlow700',fontSize=34,leading=35,textColor=RED,spaceAfter=1*mm)
category_en=ParagraphStyle('ce',parent=base['Normal'],fontName='Inter500',fontSize=10.8,leading=12.5,textColor=MUTED)
subsection=ParagraphStyle('sub',parent=base['Heading3'],fontName='Barlow700',fontSize=17,leading=18,textColor=INK,spaceBefore=3.5*mm,spaceAfter=1.5*mm)
item_name=ParagraphStyle('in',parent=base['Normal'],fontName='Barlow700',fontSize=13.4,leading=14.5,textColor=INK)
item_en=ParagraphStyle('ien',parent=base['Normal'],fontName='Inter500',fontSize=8.3,leading=9.3,textColor=MUTED)
desc_it=ParagraphStyle('di',parent=base['Normal'],fontName='Inter500',fontSize=9.2,leading=10.3,textColor=MUTED)
desc_en=ParagraphStyle('de',parent=base['Normal'],fontName='Inter400',fontSize=7.8,leading=8.8,textColor=colors.HexColor('#918980'))
price_style=ParagraphStyle('pr',parent=base['Normal'],fontName='Barlow700',fontSize=13.2,leading=14.5,textColor=RED,alignment=TA_RIGHT)
small=ParagraphStyle('small',parent=base['Normal'],fontName='Inter400',fontSize=10.7,leading=13.3,textColor=MUTED)
small_bold=ParagraphStyle('sb',parent=small,fontName='Inter600',textColor=INK)
allergen_header=ParagraphStyle('allergen-header',parent=small_bold,textColor=colors.white)
allergen_notice=ParagraphStyle('allergen-notice',parent=small_bold,alignment=TA_CENTER,leading=14.2)
allergen_notes=ParagraphStyle('allergen-notes',parent=small,alignment=TA_CENTER,leading=14.2)
aper_name=ParagraphStyle('aper-name',parent=item_name,leading=13.4)
aper_en=ParagraphStyle('aper-en',parent=item_en,leading=8.3)
aper_desc_it=ParagraphStyle('aper-di',parent=desc_it,leading=9.2)
aper_desc_en=ParagraphStyle('aper-de',parent=desc_en,leading=7.8)
aper_price=ParagraphStyle('aper-pr',parent=price_style,leading=13.2)
aper_sub=ParagraphStyle('aper-sub',parent=subsection,spaceBefore=1.5*mm,spaceAfter=1*mm,textColor=RED)

def page_chrome(canvas,doc):
    page_width,page_height=canvas._pagesize
    canvas.saveState(); canvas.setFillColor(PAPER); canvas.rect(0,0,page_width,page_height,fill=1,stroke=0)
    if doc.page>2:
        canvas.setFont('Inter700',8.5); canvas.setFillColor(INK); canvas.drawString(15*mm,page_height-9*mm,'SUGAR CAFÈ')
        canvas.setFillColor(RED); canvas.drawRightString(page_width-15*mm,page_height-9*mm,'BAR · CICCHETTERIA · APERITIVI')
        canvas.setStrokeColor(INK); canvas.setLineWidth(.7); canvas.line(15*mm,page_height-11*mm,page_width-15*mm,page_height-11*mm)
        canvas.setFont('Inter400',8); canvas.setFillColor(MUTED); canvas.drawCentredString(page_width/2,8*mm,str(doc.page-2))
    canvas.restoreState()

doc=BaseDocTemplate(str(OUTPUT),pagesize=A4,leftMargin=15*mm,rightMargin=15*mm,topMargin=15*mm,bottomMargin=13*mm,title='Sugar Cafè - Menù',author='Sugar Cafè')
frame=Frame(15*mm,13*mm,A4[0]-30*mm,A4[1]-28*mm,id='main',showBoundary=0)
LANDSCAPE_A4=landscape(A4)
landscape_frame=Frame(15*mm,13*mm,LANDSCAPE_A4[0]-30*mm,LANDSCAPE_A4[1]-28*mm,id='landscape',showBoundary=0)
doc.addPageTemplates([PageTemplate(id='main',pagesize=A4,frames=[frame],onPage=page_chrome),PageTemplate(id='landscape',pagesize=LANDSCAPE_A4,frames=[landscape_frame],onPage=page_chrome)])
story=[]

# Copertina
story += [Spacer(1,72*mm),Image(str(ROOT/'assets'/'logo-orizzontale.png'),width=150*mm,height=49*mm,kind='proportional',hAlign='CENTER'),Spacer(1,12*mm),Paragraph('BAR · <font color="#E30613">CICCHETTERIA</font> · APERITIVI',cover_title),Paragraph('BAR · CICCHETTI · APERITIFS',cover_sub),PageBreak()]

# Allergeni
allergen_rows=[('Cereali contenenti glutine','Grano, segale, orzo, avena, farro, kamut'),('Crostacei','Gamberi, gamberetti, aragoste, astici, scampi, granchi'),('Uova','Maionese, frittate, pasta all’uovo, biscotti, torte e gelati'),('Pesce','Pesce e prodotti derivati, anche in piccole percentuali'),('Arachidi','Arachidi, olio, burro e farina di arachidi'),('Soia','Latte di soia, tofu e prodotti derivati'),('Latte','Latte, yogurt, formaggi, biscotti, torte, gelati e creme'),('Frutta a guscio','Mandorle, nocciole, noci e anacardi'),('Sedano','Gambi, foglie, succo e polvere di sedano'),('Senape','Semi, polpa, olio, germogli e foglie di senape'),('Sesamo','Semi, farina, pasta, olio e burro di sesamo'),('Solfiti','Conserve, sottaceti, aceto, funghi secchi, bibite e succhi'),('Lupini','Farina, proteine, concentrato e germogli di lupino'),('Molluschi','Ostriche, vongole, capesante, cozze e altri molluschi')]
story += [Paragraph('ALLERGENI',allergen_title)]
data=[[Paragraph('ALLERGENE',allergen_header),Paragraph('ALCUNI ESEMPI',allergen_header)]]+[[Paragraph(a,small_bold),Paragraph(b,small)] for a,b in allergen_rows]
t=Table(data,colWidths=[55*mm,111*mm],repeatRows=1)
t.setStyle(TableStyle([('VALIGN',(0,0),(-1,-1),'MIDDLE'),('BACKGROUND',(0,0),(-1,0),INK),('TEXTCOLOR',(0,0),(-1,0),colors.white),('GRID',(0,0),(-1,-1),.3,LINE),('LEFTPADDING',(0,0),(-1,-1),2.5*mm),('RIGHTPADDING',(0,0),(-1,-1),2.5*mm),('TOPPADDING',(0,0),(-1,-1),2.3*mm),('BOTTOMPADDING',(0,0),(-1,-1),2.3*mm)]))
story += [t,Spacer(1,5*mm),Paragraph('SI PREGA DI COMUNICARE AL PERSONALE ALLERGIE O INTOLLERANZE',allergen_notice),Spacer(1,3*mm),Paragraph('<b>ALCUNI AVVISI IMPORTANTI</b><br/>È prevista una maggiorazione per il cibo da asporto di 0,50 €.<br/><i>There is a €0.50 surcharge for takeaway food.</i><br/><br/>I piatti sono soggetti alla disponibilità degli ingredienti.<br/><i>Dishes are subject to ingredient availability.</i><br/><br/>Non si paga il coperto. <i>No cover charge.</i>',allergen_notes),PageBreak()]

category_labels={'caffetteria':'Coffee','brioche':'Brioche - Croissants','succhi':'Fruit juices','bibite':'Soft drinks','aperitivi-analcolici':'Non-alcoholic aperitifs','aperitivi-alcolici':'Alcoholic aperitifs','la-cantina':'Wines from our cellar','liquori-amari':'Liqueurs & digestifs','cocktails':'Cocktails','birre-bottiglia':'Bottled beers','birre-spina':'Draft beers','toast':'Toast','piadine':'Piadine','panini':'Sandwiches','panini-speciali':'Special sandwiches','bruschette':'Bruschetta','pizze':'Pizza','antipasti':'Starters','cicchetti':'Cicchetti','piatti-freddi':'Cold dishes','insalatone':'Salads','insalatone-speciali':'Special salads','primi':'First courses','secondi':'Main courses','dolci':'Desserts'}

def price_value(item):
    if item['name'].lower()=='aggiunte': return 9999
    m=re.search(r'\d+(?:[,.]\d+)?',item['price']); return float(m.group().replace(',','.')) if m else 9999

def ordered(items):
    items=[item for item in items if item.get('available',True)]
    if not any(i.get('subsection') for i in items): return [item for _,item in sorted(enumerate(items),key=lambda p:(price_value(p[1]),p[0]))]
    groups=[]
    for item in items:
        if not groups or groups[-1][0]!=item.get('subsection'): groups.append([item.get('subsection'),[]])
        groups[-1][1].append(item)
    return [item for _,group in groups for _,item in sorted(enumerate(group),key=lambda p:(price_value(p[1]),p[0]))]

def item_flow(item,category_id,col_width):
    tr=translations.get(f"{category_id}|||{item['name']}|||{item.get('description','')}",{}); left=[Paragraph(item['name'],item_name)]
    translated_name=item.get('nameEn') or tr.get('name')
    translated_description=item.get('descriptionEn') or tr.get('description')
    if translated_name: left.append(Paragraph(translated_name,item_en))
    if item.get('description'):
        if category_id in ('liquori-amari','cocktails') and translated_description:
            left.append(Paragraph(f"{item['description']} <font name='Inter400' size='7.8' color='#918980'> · {translated_description}</font>",desc_it))
        else:
            left.append(Paragraph(item['description'],desc_it))
            if translated_description: left.append(Paragraph(translated_description,desc_en))
    price_width=58*mm if category_id=='la-cantina' else (26*mm if col_width>=85*mm else 19*mm)
    tab=Table([[left,Paragraph(item['price'],price_style)]],colWidths=[col_width-price_width,price_width])
    tab.setStyle(TableStyle([('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),0),('RIGHTPADDING',(0,0),(-1,-1),0),('RIGHTPADDING',(0,0),(0,0),2*mm),('TOPPADDING',(0,0),(-1,-1),.1*mm),('BOTTOMPADDING',(0,0),(-1,-1),.8*mm),('LINEBELOW',(0,0),(-1,-1),.35,LINE)]))
    return [tab]

def column_flows(items,category_id,col_width):
    flows=[]; current=None
    for item in items:
        if item.get('subsection')!=current:
            current=item.get('subsection')
            if current: flows.append(Paragraph(f"{current.upper()} <font name='Inter500' size='7.8' color='#716B64'>{item.get('subsectionEn','')}</font>",subsection))
        flows.extend(item_flow(item,category_id,col_width))
    return flows

def measured_flow_height(flows,col_width):
    return sum(flowable.wrap(col_width,10000)[1] for flowable in flows)

def balanced_two_column_chunks(items,category_id,col_width):
    if len(items)<2:
        return [items,[]]
    best=None
    for split in range(1,len(items)):
        left=items[:split]; right=items[split:]
        left_height=measured_flow_height(column_flows(left,category_id,col_width),col_width)
        right_height=measured_flow_height(column_flows(right,category_id,col_width),col_width)
        score=(max(left_height,right_height),abs(left_height-right_height))
        if best is None or score<best[0]:
            best=(score,[left,right])
    return best[1]

def aperitivo_item_flow(item,category_id,col_width):
    tr=translations.get(f"{category_id}|||{item['name']}|||{item.get('description','')}",{}); left=[Paragraph(item['name'],aper_name)]
    translated_name=item.get('nameEn') or tr.get('name')
    translated_description=item.get('descriptionEn') or tr.get('description')
    if translated_name: left.append(Paragraph(translated_name,aper_en))
    if item.get('description'):
        if translated_description:
            left.append(Paragraph(f"{item['description']} <font name='Inter400' size='7.8' color='#918980'> · {translated_description}</font>",aper_desc_it))
        else:
            left.append(Paragraph(item['description'],aper_desc_it))
    tab=Table([[left,Paragraph(item['price'],aper_price)]],colWidths=[col_width-21*mm,21*mm])
    tab.setStyle(TableStyle([('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),0),('RIGHTPADDING',(0,0),(-1,-1),0),('RIGHTPADDING',(0,0),(0,0),2*mm),('TOPPADDING',(0,0),(-1,-1),.1*mm),('BOTTOMPADDING',(0,0),(-1,-1),.8*mm),('LINEBELOW',(0,0),(-1,-1),.35,LINE)]))
    return [tab]

def aperitivi_block(non_alcoholic,alcoholic,total_width=180*mm):
    entries=[('header','ANALCOLICI <font name="Inter500" size="7.8" color="#716B64">Non-alcoholic</font>',None)]
    entries += [('item',item,non_alcoholic['id']) for item in ordered(non_alcoholic['items'])]
    entries += [('header','ALCOLICI <font name="Inter500" size="7.8" color="#716B64">Alcoholic</font>',None)]
    entries += [('item',item,alcoholic['id']) for item in ordered(alcoholic['items'])]
    split=18
    columns=[]
    col_width=total_width/2
    usable=col_width-8*mm
    for chunk in (entries[:split],entries[split:]):
        flows=[]
        for kind,value,category_id in chunk:
            if kind=='header': flows.append(Paragraph(value,aper_sub))
            else: flows.extend(aperitivo_item_flow(value,category_id,usable))
        columns.append(flows)
    cols=Table([columns],colWidths=[col_width,col_width],hAlign='LEFT')
    cols.setStyle(TableStyle([('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),4*mm),('RIGHTPADDING',(0,0),(-1,-1),4*mm),('LEFTPADDING',(0,0),(0,0),0),('RIGHTPADDING',(-1,0),(-1,0),0)]))
    return [Paragraph('APERITIVI',category_title),Paragraph('Aperitifs',category_en),HRFlowable(width='100%',thickness=1.4,color=INK),Spacer(1,2*mm),cols,Spacer(1,4*mm)]

def liquori_cocktails_block(liquori,cocktails,total_width):
    entries=[('header','LIQUORI <font name="Inter500" size="9" color="#716B64">Liqueurs &amp; digestifs</font>',None)]
    entries += [('item',item,liquori['id']) for item in ordered(liquori['items'])]
    entries += [('header','COCKTAILS',None)]
    entries += [('item',item,cocktails['id']) for item in ordered(cocktails['items'])]
    split=22
    col_width=total_width/2; usable=col_width-8*mm; columns=[]
    for chunk in (entries[:split],entries[split:]):
        flows=[]
        for kind,value,category_id in chunk:
            if kind=='header': flows.append(Paragraph(value,aper_sub))
            else: flows.extend(item_flow(value,category_id,usable))
        columns.append(flows)
    cols=Table([columns],colWidths=[col_width,col_width],hAlign='LEFT')
    cols.setStyle(TableStyle([('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),4*mm),('RIGHTPADDING',(0,0),(-1,-1),4*mm),('LEFTPADDING',(0,0),(0,0),0),('RIGHTPADDING',(-1,0),(-1,0),0)]))
    return [Paragraph('LIQUORI &amp; COCKTAILS',category_title),Paragraph('Liqueurs &amp; cocktails',category_en),HRFlowable(width='100%',thickness=1.4,color=INK),Spacer(1,2*mm),cols,Spacer(1,4*mm)]

def category_block(category,total_width=180*mm):
    items=ordered(category['items']); column_count=1 if category['id']=='la-cantina' else 2; col_width=total_width/column_count
    title=[Paragraph(category['name'].upper(),category_title),Paragraph(category_labels.get(category['id'],''),category_en)]
    block=[]
    block.extend(title)
    block += [HRFlowable(width='100%',thickness=1.4,color=INK),Spacer(1,3*mm)]
    gutter=0 if column_count==1 else 8*mm
    usable_col_width=col_width-gutter
    chunks=[items] if column_count==1 else balanced_two_column_chunks(items,category['id'],usable_col_width)
    cols=Table([[column_flows(chunk,category['id'],usable_col_width) for chunk in chunks]],colWidths=[col_width]*column_count,hAlign='LEFT')
    cols.setStyle(TableStyle([('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),gutter/2),('RIGHTPADDING',(0,0),(-1,-1),gutter/2),('LEFTPADDING',(0,0),(0,0),0),('RIGHTPADDING',(-1,0),(-1,0),0)]))
    block += [cols]
    block += [Spacer(1,4*mm)]
    return block

def alcolici_liquori_block(alcolici,liquori):
    alcolici_block=category_block(alcolici)
    liquori_block=category_block(liquori)
    return alcolici_block[:-1]+liquori_block

category_by_id={category['id']:category for category in menu['categories']}
print_order=['caffetteria','brioche','succhi','bibite','aperitivi-analcolici','aperitivi-alcolici','liquori-amari','la-cantina','cocktails','birre-bottiglia','birre-spina','toast','piadine','panini','panini-speciali','bruschette','pizze','antipasti','cicchetti','piatti-freddi','insalatone','insalatone-speciali','primi','secondi','dolci']
print_categories=[category_by_id[category_id] for category_id in print_order]

i=0
while i<len(print_categories):
    category=print_categories[i]
    next_category=print_categories[i+1] if i+1<len(print_categories) else None
    if category['id']=='bibite' and next_category and next_category['id']=='aperitivi-analcolici':
        story.append(KeepTogether(category_block(category)+category_block(next_category)))
        i+=2
        continue
    if category['id']=='aperitivi-alcolici' and next_category and next_category['id']=='liquori-amari':
        story.append(KeepTogether(alcolici_liquori_block(category,next_category)))
        i+=2
        continue
    if category['id']=='toast' and next_category and next_category['id']=='piadine':
        story.append(KeepTogether(category_block(category)+category_block(next_category)))
        i+=2
        continue
    story.append(KeepTogether(category_block(category)))
    i+=1

doc.build(story)
print(OUTPUT)
