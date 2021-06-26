# RGB Gaps

Online RGB distance meter.

https://rgbgaps.vercel.app


## About

Draw colors as points in the **RGB** space and calculates the distances between
them using the **euclidean distance** for three-dimensional space.

![d = \sqrt{\left(x_1 - x_0\right)^2 + \left(y_1 - y_0\right)^2 + \left(z_1 - z_0\right)^2}][distance]

The **RGB** space is represented as an **euclidean 3D space** when each chanel
correspond to the **OpenGL** spacial cartesian cordinates axis, thus the red
(**R**), green (**G**) and blue (**B**) channel are represented along the **X**
(right), **Y** (up) and **Z** (out the screen) axis respectively.

You can controle some camera and render options from the sidebar and modify the
color palette using the text editor.

_**Note**: This tool still may not work properly with touch screens._


<!-- References -->
[rgbgaps]: https://rgbgaps.vercel.app
[distance]: public/distance.png "Euclidean distance for three-dimensional space"
