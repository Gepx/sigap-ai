from rembg import remove
from PIL import Image

input_path = 'public/assets/cta_man_smiling.png'
output_path = 'public/assets/cta_man_smiling_transparent.png'

input = Image.open(input_path)
output = remove(input)
output.save(output_path)
print("Done")
