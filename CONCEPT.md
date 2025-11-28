# Ahura

A ui development tool to visually design a web page, and it turns it into code.

Tools: React, Tailwind

## Conccept

It's basically React+Tailwind based. It focuses on building simple static ui rather than logic.
It uses tailwind for css.

supports basic css attributes like color, padding, margin and so on.
it visually shows padding space or margin, it's let's the user to select display type (fixed, absoulte, relative)

## UI

The app consists of 3 parts:

1. The left panel shows a tree of all elements in the current component/page.
2. The Main area in the middle shows the current page/component.
3. The right panel shows the attributes of the selected element by the user.

In the left panel there would be a + button under each element to add more children.
children are by default div elements, unless the user change their tag in the right panel.
by updating the type of the element, their attrs should change accordingly.
