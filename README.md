# A Interactive Visual Representation of the Collatz Conjecture

<p>
    <img src="/Demo.PNG"/>
</p>

This program will display an interactive diagram of the chain of numbers described
by the collatz conjecture. It uses easyPZ.js to allow the user to drag and resize.
The image will dynamically adapt to changes (e.g. adding more nodes as you zoom in).

Note about terminology:
<ul>
<li><b>Loop</b>: Show duplicate spirals of generated numbers</li>
<li><b>Phantom</b>: A spiral that should have a base connection to some spiral number, but instead has a factor of 2.
<li><b>Threes</b>: A spiral which consists of only a*2^n, and will not branch further.
</ul>
