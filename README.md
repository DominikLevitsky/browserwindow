#browserwindow

A simple Adobe Photoshop script for adding a browser window (or any kind of border) to your designs!

##Installation
Unzip the contents of the downloaded archive to your Photoshop scripts folder.
For Windows the default path for it is at

    C:/Program Files (x86)/Adobe/Adobe Photoshop CS6/Presets/Scripts

and for 64-bit systems at

    C:/Program Files/Adobe/Adobe Photoshop CS6 (64 Bit)/Presets/Scripts

##Usage
Open the document, where you want to apply the browser window. 

Run the script by clicking **File > Scripts > browserwindow**

**IMPORTANT! The script will merge all the layers in the opened document!**

##Customization
The browserwindow script is made to be customizable. Feel free to do anything you want with it. The browserwindow.psd is included just for demonstration purposes. The script doesn't just apply that browse window, you can make it to apply an iPhone, iPad, whatever.

You can customize the browserwindow.psd as you like, just remember:

+ *Do not* remove or rename the browserwindow group;
+ *Do not* remove or rename any layer in the browserwindow group;

Because this will break the script.

Though, you can change the layers as you want. You can resize them or add styles to them. You can create all your own layers of any size or form inside the group, just remember to keep the naming of them. You don't need to rasterize the layers, browserwindow will rasterize them anyways during the process. You can even change the order of the layers inside the group, just don't put them inside other groups, or outside the browserwindow group.

The is also a short README in the browserwindow.psd, so you don't forget all this stuff.

##FAQ
+ **IMPORTANT! The script will merge all the layers in the opened document!** Your document may contain
  layers or a plain image, just remember, that it will merge everything in the document. Better 
  keep your working copy safe.
+ A Photoshop document must be open and active, in order to make the script work.
+ A new document is created and the browserwindow is applied in that document.
+ Restart Photoshop, if you don't see the script under File > Scripts
+ The script is currently tested only in Photoshop CS6.

##Future versions plans
+ Remove the layer rasterization. Keep the layers as shapes during the whole process (this can be tricky).
+ Support file selection for different browser styles.

-----
Distributed under the [GNU GPL](http://www.gnu.org/licenses/gpl.html) license.
