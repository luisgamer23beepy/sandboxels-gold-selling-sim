// ============================================================
// SELL TOOL
// ============================================================

var sellMoney = 0;
var sellCooldown = 0;
var sellUsing = false;
var sellSoldGold = 0;

var sellBrushSize = 15;
var sellPreviousBrushSize = 5;
var sellEquipped = false;


// ============================================================
// MONEY + COOLDOWN DISPLAY
// ============================================================

var sellDisplay = document.createElement("div");

sellDisplay.id = "sell-display";

sellDisplay.style.position = "fixed";
sellDisplay.style.top = "10px";
sellDisplay.style.right = "15px";
sellDisplay.style.zIndex = "999999";
sellDisplay.style.color = "#FFD700";
sellDisplay.style.fontFamily = "Arial, sans-serif";
sellDisplay.style.fontSize = "22px";
sellDisplay.style.fontWeight = "bold";
sellDisplay.style.textShadow = "2px 2px 3px black";
sellDisplay.style.pointerEvents = "none";
sellDisplay.style.textAlign = "right";

sellDisplay.innerHTML =
    "Money: 0<br>" +
    "Sell tool Cooldown: Ready";

document.body.appendChild(sellDisplay);


function updateSellDisplay() {

    if (sellCooldown > 0) {

        sellDisplay.innerHTML =
            "Money: " + sellMoney +
            "<br>" +
            "Sell tool Cooldown: " +
            sellCooldown.toFixed(1) + "s";

    } else {

        sellDisplay.innerHTML =
            "Money: " + sellMoney +
            "<br>" +
            "Sell tool Cooldown: Ready";
    }
}


// ============================================================
// SELL TOOL
// ============================================================

elements.sell = {

    color: "#FFD700",

    category: "tools",

    excludeRandom: true,

    maxSize: 15,

    desc: "Deletes everything inside the brush and pays 1 Money for every gold pixel.",


    // --------------------------------------------------------
    // EQUIP
    // --------------------------------------------------------

    onSelect: function() {

        sellEquipped = true;

        // Save the brush size the player was using
        sellPreviousBrushSize = mouseSize;

        // Force SELL to 15
        mouseSize = sellBrushSize;

        checkMouseSize(true);

        updateSellDisplay();
    },


    // --------------------------------------------------------
    // START OF A USE
    // --------------------------------------------------------

    onMouseDown: function() {

        // Make absolutely sure the brush is 15
        mouseSize = sellBrushSize;
        checkMouseSize(true);


        // Cannot use SELL during cooldown
        if (sellCooldown > 0) {
            sellUsing = false;
            return;
        }


        // Begin one SELL action
        sellUsing = true;

        // Reset the gold counter for this action
        sellSoldGold = 0;
    },


    // --------------------------------------------------------
    // EVERY PIXEL INSIDE THE BRUSH
    // --------------------------------------------------------

    tool: function(pixel) {

        // If the click was blocked by cooldown,
        // don't delete anything.
        if (!sellUsing) {
            return;
        }


        // Count GOLD before deleting the pixel.
        if (pixel.element === "cut_gold") {
            sellSoldGold++;
        }


        // DELETE EVERYTHING.
        // Gold, dirt, stone, qwerten, water, etc.
        deletePixel(pixel.x, pixel.y);
    },


    // --------------------------------------------------------
    // END OF A USE
    // --------------------------------------------------------

    onMouseUp: function() {

        if (!sellUsing) {
            return;
        }


        sellUsing = false;


        // Give money equal to the number of gold
        // pixels that were inside the brush/action.
        sellMoney += sellSoldGold;

        updateSellDisplay();


        // Start the 10 second cooldown.
        sellCooldown = 10;
    }
};


// ============================================================
// COOLDOWN TIMER
// ============================================================

setInterval(function() {

    if (sellCooldown > 0) {

        sellCooldown -= 0.1;

        if (sellCooldown < 0) {
            sellCooldown = 0;
        }

        updateSellDisplay();
    }

}, 100);


// ============================================================
// KEEP BRUSH AT 15 WHILE SELL IS EQUIPPED
// ============================================================

setInterval(function() {

    if (currentElement === "sell") {

        if (!sellEquipped) {

            sellEquipped = true;

            sellPreviousBrushSize = mouseSize;
        }


        // Do not allow the player to change SELL's brush size.
        if (mouseSize !== sellBrushSize) {
            mouseSize = sellBrushSize;
            checkMouseSize(true);
        }

    } else {

        // SELL was unequipped
        if (sellEquipped) {

            sellEquipped = false;

            // Restore the previous brush size
            mouseSize = sellPreviousBrushSize;
            checkMouseSize(true);
        }
    }

}, 10);

// ============================================================
// CUT GOLD
// ============================================================

elements.cut_gold = {
    color: ["#f5ff65", "#e7f600"],
    behavior: behaviors.SOLID,
    category: "solids",
    state: "solid",
    density: 19300,
    desc: "Gold that has been cut with a jeweler's saw."
};


// ============================================================
// JEWELER'S SAW
// ============================================================

var jewelersSawBrushSize = 3;
var jewelersSawPreviousBrushSize = 5;
var jewelersSawEquipped = false;


elements.jewelers_saw = {

    color: "#BFC5CC",

    category: "tools",

    excludeRandom: true,

    desc: "Cuts gold into cut gold.",


    // --------------------------------------------------------
    // EQUIP
    // --------------------------------------------------------

    onSelect: function() {

        jewelersSawEquipped = true;

        // Remember current brush size
        jewelersSawPreviousBrushSize = mouseSize;

        // Force brush size to 3
        mouseSize = jewelersSawBrushSize;

        checkMouseSize(true);
    },


    // --------------------------------------------------------
    // USE ON GOLD
    // --------------------------------------------------------

    tool: function(pixel) {

        // Only affect gold
        if (!pixel || pixel.element !== "gold") {
            return;
        }

        // Turn gold into cut_gold
        changePixel(pixel, "cut_gold");
    }
};


// ============================================================
// KEEP BRUSH SIZE AT 3 WHILE EQUIPPED
// ============================================================

setInterval(function() {

    if (currentElement === "jewelers_saw") {

        if (!jewelersSawEquipped) {
            jewelersSawEquipped = true;
            jewelersSawPreviousBrushSize = mouseSize;
        }

        // Lock brush size to 3
        if (mouseSize !== jewelersSawBrushSize) {
            mouseSize = jewelersSawBrushSize;
            checkMouseSize(true);
        }

    } else {

        // Restore previous brush size after unequipping
        if (jewelersSawEquipped) {

            jewelersSawEquipped = false;

            mouseSize = jewelersSawPreviousBrushSize;
            checkMouseSize(true);
        }
    }

}, 10);