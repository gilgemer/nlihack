# Usage: fetch_data.py dd/mm/yyyy

import requests
import json
import shutil
import sys

class Record(object):
	def __init__(self,title, photographer, archive, image_url, year):
		self._title = title
		self._photographer = photographer
		self._archive = archive
		self._image_url = image_url
		self._year = year

	def __str__(self):
		return "title: {0},\nphotographer: {1},\narchive: {2},\nimg_url: {3},\nyear: {4}\n".format(self._title, self._photographer, self._archive, self._image_url, self._year)

record_collection = []

# date example:  13+%D7%91%D7%99%D7%95%D7%A0%D7%99+1969

MONTHS = {'1' : r"%D7%91%D7%99%D7%A0%D7%95%D7%90%D7%A8",
		  '2' : r"%D7%91%D7%A4%D7%91%D7%A8%D7%95%D7%90%D7%A8",
		  '3' : r"%D7%91%D7%9E%D7%A8%D7%A5",
		  '4' : r"%D7%91%D7%90%D7%A4%D7%A8%D7%99%D7%9C",
		  '5' : r"%D7%91%D7%9E%D7%90%D7%99",
		  '6' : r"%D7%91%D7%99%D7%95%D7%A0%D7%99",
		  '7' : r"%D7%91%D7%99%D7%95%D7%9C%D7%99",
		  '8' : r"%D7%91%D7%90%D7%95%D7%92%D7%95%D7%A1%D7%98",
		  '9' : r"%D7%91%D7%A1%D7%A4%D7%98%D7%9E%D7%91%D7%A8",
		  '10': r"%D7%91%D7%90%D7%95%D7%A7%D7%98%D7%95%D7%91%D7%A8",
		  '11': r"%D7%91%D7%A0%D7%95%D7%91%D7%9E%D7%91%D7%A8",
		  '12': r"%D7%91%D7%93%D7%A6%D7%9E%D7%91%D7%A8"
		}
# Get all objects from a certain date

SEARCH_QUERY = r"http://primo.nli.org.il/PrimoWebServices/xservice/search/brief?institution=NNL&loc=local,scope:(NNL)&query=lsr08,exact,%D7%94%D7%A1%D7%A4%D7%A8%D7%99%D7%99%D7%94+%D7%94%D7%9C%D7%90%D7%95%D7%9E%D7%99%D7%AA+%D7%90%D7%A8%D7%9B%D7%99%D7%95%D7%9F+%D7%93%D7%9F+%D7%94%D7%93%D7%A0%D7%99&query=lsr08,exact,{}&indx=1&bulkSize=50&json=true"
PRESENTATION_QUERY = r"http://iiif.nli.org.il/IIIFv21/DOCID/{}/manifest"
IMAGE_INFO_QUERY = r"http://iiif.nli.org.il/IIIFv21/{}/info.json"

# Generate search url from argument
date = sys.argv[1].split("/")
day = int(date[0])
month = int(date[1])
year = int(date[2])

formatted_date = str(day) + '+' + MONTHS[str(month)] + '+' + str(year)

# Search for all objects from a given date
r = requests.get(SEARCH_QUERY.format(formatted_date))
data = r.json()

count = 0
try: 
	check = data['SEGMENTS']['JAGROOT']['RESULT']['DOCSET']['DOC']
except:
	print "No records match that date"
	exit()

for obj in data['SEGMENTS']['JAGROOT']['RESULT']['DOCSET']['DOC']:
	try:
		record_id = obj['PrimoNMBib']['record']['control']['recordid']
	except:
		count += 1
		continue
	# Perform Presentation API search:
	r = requests.get(PRESENTATION_QUERY.format(record_id)).json()
	try:
		image_id = r['sequences'][0]['canvases'][0]['images'][0]['@id']
	except:
		count += 1
		continue
	try:
		title = [it[u'value'] for it in r['metadata'] if it[u'label'] == u'Title']
	except:
		title = 'Title not available'
	try:
		photographer = [it[u'value'] for it in r['metadata'] if it[u'label'] == u'The Creator']
	except:
		photographer = 'IPPA Staff'

	# Perform image information search
	r = requests.get(IMAGE_INFO_QUERY.format(image_id)).json()
	max_width = r['profile'][1]['maxWidth']
	max_height = r['profile'][1]['maxHeight']

	# Download image
	image_request_url = r"http://iiif.nli.org.il/IIIFv21/{0}/full/{1},{2}/0/default.jpg".format(image_id, max_width, max_height)

	# r = requests.get(image_request_url)
	# if r.status_code == 200:
	# 	import pdb; pdb.set_trace()
	# 	with open('./' + str(count) + '.jpg', 'wb') as f:
	# 		r.raw.decode_content = True
	# 		shutil.copyfileobj(r.raw, f)   

	# Creating record object:
	record_collection.append(Record(title, photographer, "Dan Hadani Archive", image_request_url, str(year)))
	count += 1

for record in set(record_collection):
	print record