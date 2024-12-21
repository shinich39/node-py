import sys
from PIL import Image

from resizeimage import resizeimage

def main(*args):
  with open('./test/src/image.jpg', 'r+b') as f:
      with Image.open(f) as image:
          cover = resizeimage.resize_cover(image, [200, 100])
          cover.save('./test/src/image-edit.jpg', image.format)

if __name__ == '__main__':
  main(*sys.argv[1:])