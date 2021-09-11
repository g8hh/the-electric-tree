addLayer("m", {
    tabFormat: {
        "Main":{
            content: [
                "main-display",
                "prestige-button"
            ],
        },
        "Upgrades":{
            content: [
                "main-display",
                "upgrades"
            ],
        },
        "Buyables":{
            content: [
                "main-display",
                "buyables"
            ],
            unlocked() { return tmp.m.buyables[11].unlocked }
        },
    },
    name: "money", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "M", // This appears on the layer's node. Default is the id with the first letter capitalized
    row: 0, // Row the layer is in on the tree (0 is the first row)
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    color: "#1d853e",
    hotkeys: [
        {key: "u", description: "Press U to buy all upgrades of the layer you're in", onPress(){buyAll(player.tab)}},
        {key: "r", description: "Press R to bulk buy all buyables of the layer you're in", onPress(){buyAllBuyables(player.tab)}},
        {key: "m", description: "Press M to Money Reset", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return player.points.gte(5) || player.m.unlocked},
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
        best: new Decimal(0),
        total: new Decimal(0),
        first: 0,
        auto: false,
        pseudoUpgs: [],
    }},
    requires() { return new Decimal(5) }, // Can be a function that takes requirement increases into account
    resource: "money", // Name of prestige currency
    baseResource: "KWh", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent() { // Prestige currency exponent
		exp = new Decimal(1)
		if(inChallenge("w", 11)) {exp = exp.div(2)}
        if(inChallenge("s", 12)) {
            if(getBuyableAmount("p", 21).eq(1)) exp = exp.div(1.30)
        }
		return exp
	},
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
		if(hasUpgrade("m", 15)) {mult = mult.times(tmp.m.upgrades[15].effect)}
		if(hasUpgrade("m", 25)) {mult = mult.times(tmp.m.upgrades[25].effect)}
        if(inChallenge("n", 11)) {
            mult = mult.div(new Decimal(10).pow(player.m.upgrades.length))
        }
        if(inChallenge("s", 12)) {
            if(getBuyableAmount("p", 11).add(getBuyableAmount("p", 12)).add(getBuyableAmount("p", 13)).add(getBuyableAmount("p", 21)).add(getBuyableAmount("p", 22)).add(getBuyableAmount("p", 23)).neq(2)) mult = new Decimal(0)
        }
        mult = mult.times(tmp.cap.effect)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        exp = new Decimal(1)
        return exp
    },
	effect() {
        if(inChallenge("s", 11)) {
            return new Decimal(1)
        }
		eff = new Decimal(1)
		if(hasUpgrade("m", 21)) {
			exp = new Decimal(2)
			eff = player.m.points.add(1).log10()
			if(hasUpgrade("m", 22)) {exp = exp.add(tmp.m.upgrades[22].effect)}
            if(hasChallenge("w", 21)) {exp = exp.add(1)}
            exp = exp.add(tmp.m.buyables[13].effect)
			eff = eff.pow(exp).add(1)
		}
		return eff
	},
	effectDescription() {
		if(hasUpgrade("m", 21)) {
            if(hasUpgrade("m", 42)) {
                if(hasUpgrade("m", 41)) {
                    if(hasUpgrade("m", 24)) {return "Which Are Boosting Electricity Gain By "+format(tmp.m.effect)+"x And Dividing Battery/Coal Power Plant Cost By "+format(tmp.m.effect)+"x"}
                    return "Which Are Boosting Electricity Gain By "+format(tmp.m.effect)+"x And Dividing Coal Power Plant Cost By "+format(tmp.m.effect)+"x"
                }
                if(hasUpgrade("m", 24)) {return "Which Are Boosting Electricity Gain By "+format(tmp.m.effect)+"x And Dividing Battery Cost By "+format(tmp.m.effect)+"x"}
                return "Which Are Boosting Electricity Gain By "+format(tmp.m.effect)+"x"
            }
            if(hasUpgrade("m", 41)) {
                if(hasUpgrade("m", 24)) {return "Which Are Boosting Electricity Gain By "+format(tmp.m.effect)+"x And Dividing Battery/Coal Power Plant Cost By "+format(tmp.m.effect.pow(0.5))+"x"}
                return "Which Are Boosting Electricity Gain By "+format(tmp.m.effect)+"x And Dividing Coal Power Plant Cost By "+format(tmp.m.effect.pow(0.5))+"x"
            }
			if(hasUpgrade("m", 24)) {return "Which Are Boosting Electricity Gain By "+format(tmp.m.effect)+"x And Dividing Battery Cost By "+format(tmp.m.effect.pow(0.5))+"x"}
			return "Which Are Boosting Electricity Gain By "+format(tmp.m.effect)+"x"
		}
	},
    passiveGeneration() { return hasMilestone("b", 1) },
    doReset(resettingLayer){
        let keep = []
		if(hasMilestone("b", 0) || hasMilestone("c", 1)) keep.push("upgrades")
        if(hasChallenge("w", 12)) keep.push("buyables")
        if (layers[resettingLayer].row > this.row) layerDataReset(this.layer, keep)
    },
    upgrades: {
        11: {
            title: "Employees",
            description: "Hire employees to make more electricity",
            cost() { return new Decimal(1) },
            unlocked() { return player.m.unlocked || hasUpgrade("m", 11) },
            effect() { 
				eff = new Decimal(player.m.points.add(1).log10().pow(2)).add(2)
				if(hasUpgrade("m", 23)) {eff = eff.pow(tmp.m.upgrades[23].effect)}
                return eff
            },
            effectDisplay() { return "*"+format(tmp.m.upgrades[11].effect) + " to electricity gain" },
        },
        12: {
            title: "Equipment",
            description: "Buy new equipment to make even more electricity",
            cost() { return new Decimal(5) },
            unlocked() { return player.m.unlocked || hasUpgrade("m", 12) },
            effect() {
                return new Decimal(5)
            },
            effectDisplay() { return "*" + format(tmp.m.upgrades[12].effect) + " to elctricity gain" },
        },
        13: {
            title: "Energy Boost",
            description: "Electricty boosts electricity gain ( Don't ask me how )",
            cost() { return new Decimal(50) },
            unlocked() { return player.m.unlocked || hasUpgrade("m", 13) },
            effect() {
                return new Decimal(player.points.add(1).log10().pow(0.5)).add(1)
            },
            effectDisplay() { return "*" + format(tmp.m.upgrades[13].effect) + " to electicity gain" },
        },
        14: {
            title: "Experts",
            description: "Hire experts to boost your production",
            cost() { return new Decimal(100) },
            unlocked() { return hasUpgrade("m", 12) || hasUpgrade("m", 14) },
            effect() {
                return new Decimal(player.m.points.add(1).log10().pow(3).add(1))
            },
            effectDisplay() { return "*" + format(tmp.m.upgrades[14].effect) + " to electricity gain" },
        },
        15: {
            title: "Market Pressure Vol1",
            description: "Refuse to sell electricity until the price goes up ( This game is slowly becoming illegal )",
            cost() { return new Decimal(10000) },
            unlocked() { return hasUpgrade("m", 14) || hasUpgrade("m", 15) },
            effect() {
                return new Decimal(player.m.points.add(1).log10().add(1).pow(0.1))
            },
            effectDisplay() { return "*" + format(tmp.m.upgrades[15].effect) + " to money gain" },
        },
		21: {
            title: "Economic Impact",
            description: "Unlock a money effect, which boosts electricty gain",
            cost() { return new Decimal(100000000) },
            unlocked() { return hasUpgrade("b", 11) || hasUpgrade("m", 21) },
        },
	    22: {
            title: "Battery Power",
            description: "Batteries boost the money effect exponent",
            cost() { return new Decimal("2.5e12") },
            unlocked() { return player.b.best.gte(3) || hasUpgrade("m", 22) },
            effect() {
                return new Decimal(player.b.points.pow(1/3))
            },
            effectDisplay() { return "+" + format(tmp.m.upgrades[22].effect) + " to money effect exponent" },
        },
		23: {
            title: "Hire Managers",
            description: "Hire managers to boost Employees effect",
            cost() { return new Decimal("1e32") },
            unlocked() { return hasUpgrade("b", 13) || hasUpgrade("m", 23) },
            effect() {
                return new Decimal(player.m.points.add(1).log10().add(1).log10().pow(0.5).add(1))
            },
            effectDisplay() { return "^" + format(tmp.m.upgrades[23].effect) + " to Employees effect" },
        },
		24: {
            title: "Cheaper Batteries",
            description: "Money effect divides battery cost at a reduced rate",
            cost() { return new Decimal("1e38") },
            unlocked() { return hasUpgrade("b", 13) || hasUpgrade("m", 24) },
        },
		25: {
            title: "Market Pressure Vol2",
            description: "Threaten to sell your electricity elsewhere if prices don't go up ( Illegal maneuvers : the return )",
            cost() { return new Decimal("1e66") },
            unlocked() { return hasUpgrade("b", 14) || hasUpgrade("m", 25) },
            effect() {
                return new Decimal(player.m.points.add(1).log10().add(1).log10().add(1).log(10).add(1).pow(5))
            },
            effectDisplay() { return "*" + format(tmp.m.upgrades[25].effect) + " to money gain" },
        },
		31: {
            title: "More Upgrades",
            description: "Unlock 3 battery upgrades",
            cost() { return new Decimal("2.5e67") },
            unlocked() { return hasUpgrade("b", 14) || hasUpgrade("m", 31) },
        },
		32: {
            title: "Even More Upgrades",
            description: "Unlock another 3 battery upgrades",
            cost() { return new Decimal("1e400") },
            unlocked() { return hasUpgrade("w", 12) || hasUpgrade("m", 32) },
        },
		33: {
            title: "Challenging",
            description: "Unlock the first worker challenge",
            cost() { return new Decimal("1e1880") },
            unlocked() { return hasUpgrade("b", 25) || hasUpgrade("m", 33) },
        },
        34: {
            title: "More Challenges",
            description: "Unlock the second worker challenge",
            cost() { return new Decimal("1e2695") },
            unlocked() { return hasUpgrade("b", 31) || hasUpgrade("m", 34) },
        },
        35: {
            title: "Battery Booster",
            description: "Battery effect ^1.1",
            cost() { return new Decimal("1e3460") },
            unlocked() { return hasChallenge("w", 12) || hasUpgrade("m", 35) },
        },
        41: {
            title: "Coal Mine",
            description: "Money effect also divides coal power plant's cost at a reduced rate",
            cost() { return new Decimal("1e14815") },
            unlocked() { return (hasUpgrade("c", 12) && player.c.points.gte(2)) || hasUpgrade("m", 41) },
        },
        42: {
            title: "Savings",
            description: "Money effect no longer divides costs at a reduced rate",
            cost() { return new Decimal("1e18670") },
            unlocked() { return (hasUpgrade("c", 13) && player.c.points.gte(3)) || hasUpgrade("m", 42) },
        },
        43: {
            title: "Another One",
            description: "Unlock a third worker challenge",
            cost() { return new Decimal("1e18680") },
            unlocked() { return (hasMilestone("w", 1) && player.c.points.gte(4)) || hasUpgrade("m", 43) },
        },
        44: {
            title: "Cooling Down",
            description: "Build a cooling system for your coal power plants",
            cost() { return new Decimal("1e19373") },
            unlocked() { return hasUpgrade("w", 31) || hasUpgrade("m", 44) },
            effect() {
                return new Decimal(player.m.points.add(1).log10().div(4000).add(1).min(15))
            },
            effectDisplay() {return "^" + format(tmp.m.upgrades[44].effect) + " to coal power plant effect"},
        },
        45: {
            title: "Upgrades+",
            description: "Unlock 9 new upgrades",
            cost() { return new Decimal("1e71720") },
            unlocked() { return hasUpgrade("c", 15) || hasUpgrade("m", 45) },
        },
        51: {
            title: "And Another",
            description: "Unlock a battery buyable",
            cost() { return new Decimal("1e379000") },
            unlocked() { return hasChallenge("n", 12) || hasUpgrade("m", 51) },
        },
        52: {
            title: "Better Cooling",
            description: "Build a better cooling system for your nuclear power plants",
            cost() { return new Decimal("1e615000") },
            unlocked() { return hasChallenge("n", 12) || hasUpgrade("m", 52) },
            effect() {
                return new Decimal(player.m.points.add(1).log10().div(500000).add(1).min(5))
            },
            effectDisplay() {return "^" + format(tmp.m.upgrades[52].effect) + " to nuclear power plant effect"},
        },
        53: {
            title: "Rest",
            description: "You have suffered to get here, rest and take this boost. Battery cost is divided by money",
            cost() { return new Decimal("1e660000") },
            unlocked() { return hasChallenge("n", 12) || hasUpgrade("m", 53) },
            effect() {
                return new Decimal(player.m.points.pow(100)).max(1)
            },
            effectDisplay() {return "/" + format(tmp.m.upgrades[53].effect) + " to battery cost"},
        },
        54: {
            title: "Take It Easy",
            description: "Another easy boost to recover. Nuclear power plant cost is divided by workers",
            cost() { return new Decimal("1e680000") },
            unlocked() { return hasChallenge("n", 12) || hasUpgrade("m", 54) },
            effect() {
                return new Decimal(player.w.points.pow(10)).max(1)
            },
            effectDisplay() {return "/" + format(tmp.m.upgrades[54].effect) + " to nuclear power plant cost"},
        },
        55: {
            title: "Calm Down",
            description: "Unlock anther layer. Might become hellish again. Also multiply electricity gain by 1e2000",
            cost() { return new Decimal("1e700000") },
            unlocked() { return hasChallenge("n", 12) || hasUpgrade("m", 55) },
            onPurchase() {player.p.unlocked = true}
        },
        61: {
            title: "Buy More",
            description: "Unlock a nuclear power plant buyable ( Don't worry, the buyable won't reset your progress :) )",
            cost() { return new Decimal("1e3750000") },
            unlocked() { return hasUpgrade("p", 22) || hasUpgrade("m", 61) },
        },
        62: {
            title: "Corrupt Batteries",
            description: "Pay corrupt poiticians to reduce the first battery buyable cost scaling",
            cost() { return new Decimal("1e9135000") },
            unlocked() { return getBuyableAmount("s", 11).gte(3) || hasUpgrade("m", 62) },
        },
        63: {
            title: "Reassemble",
            description: "Form governments with your corrupt politicians",
            cost() { return new Decimal("1e45300000") },
            unlocked() { return hasUpgrade("c", 23) || hasUpgrade("m", 63) },
            onPurchase() {player.g.unlocked = true}
        },
        64: {
            title: "Solar Boost",
            description: "Reduce the solar power plant cost exponent by 0.005",
            cost() { return new Decimal("1e5500000000") },
            unlocked() { return hasUpgrade("g", 14) || hasUpgrade("m", 64) },
        },
        65: {
            title: "Wall Street",
            description: "Unlock shares",
            cost() { return new Decimal("1e10500000000") },
            unlocked() { return getBuyableAmount("s", 11).gte(9) || hasUpgrade("m", 65) },
        },
        71: {
            title: "The 4th One",
            description: "Unlock another battery buyable",
            cost() { return new Decimal("1e14000000000") },
            unlocked() { return hasUpgrade("sh", 15) || hasUpgrade("m", 71) },
        },
        72: {
            title: "( Softcapped ) 4th Of The Name",
            description: "Remove the 3rd softcap on corrupt politician effect",
            cost() { return new Decimal("1e26000000000") },
            unlocked() { return hasUpgrade("sh", 15) || hasUpgrade("m", 72) },
        },
        73: {
            title: "Pushing A Litte Bit Further Again",
            description: "Electricity gain is raised to the 1.025th power",
            cost() { return new Decimal("1e90000000000") },
            unlocked() { return hasUpgrade("sh", 15) || hasUpgrade("m", 73) },
        },
        74: {
            title: "Corruption : The Return",
            description: "Money boosts corrupt politician gain",
            cost() { return new Decimal("1e150000000000") },
            unlocked() { return hasUpgrade("sh", 15) || hasUpgrade("m", 74) },
            effect() {
                return new Decimal(10).pow(player.m.points.add(1).log10().pow(1/3))
            },
            effectDisplay() {return "*" + format(tmp.m.upgrades[74].effect) + " to corrupt politician gain"},
        },
        75: {
            title: "Upgrade Boost",
            description: "Multiply by 25000 the amount of effective Buyable Boost levels",
            cost() { return new Decimal("1e170000000000") },
            unlocked() { return hasUpgrade("sh", 15) || hasUpgrade("m", 75) },
        },
        81: {
            title: "More Investments = More Profits",
            description: "Capitaslists' effect is stronger based on money",
            cost() { 
                if(player.com.first && !player.cap.first) return new Decimal("1e551000000000")
                return new Decimal("1e367800000000") 
            },
            unlocked() { return hasUpgrade("cap", 14) || hasUpgrade("m", 81) },
            effect() {
                return new Decimal(player.m.points.add(1).log10().add(1).log10().add(1).log10().add(1).pow(2.5))
            },
            effectDisplay() {return "*" + format(tmp.m.upgrades[81].effect) + " stronger"},
        },
        82: {
            title: "Even More Investments = Even More Profits",
            description: "The previous upgrade also boosts share gain but stronger",
            cost() { 
                if(player.com.first && !player.cap.first) return new Decimal("1e595075000000")
                return new Decimal("1e411140000000") 
            },
            unlocked() { return hasUpgrade("cap", 14) || hasUpgrade("m", 82) },
            effect() {
                return new Decimal(tmp.m.upgrades[81].effect).tetrate(2)
            },
            effectDisplay() {return "*" + format(tmp.m.upgrades[82].effect) + " to share gain"},
        },
        83: {
            title: "Electric Investment",
            description: "Capitalists' effect also boosts electricity gain but at a reduced rate",
            cost() { 
                if(player.com.first && !player.cap.first) return new Decimal("1e595200000000")
                return new Decimal("1e418880000000") 
            },
            unlocked() { return hasUpgrade("cap", 14) || hasUpgrade("m", 83) },
        },
        84: {
            title: "Now That's What I Call Being Rich",
            description: "Money boosts the corrupt politician effect",
            cost() { 
                if(player.com.first && !player.cap.first) return new Decimal("1e1.496e12")
                return new Decimal("1ee12") 
            },
            unlocked() { return hasUpgrade("cap", 14) || hasUpgrade("m", 84) },
            effect() {
                return new Decimal(player.m.points.add(1).slog().pow(8).div(1000).add(1))
            },
            effectDisplay() {return "^" + format(tmp.m.upgrades[84].effect) + " to the corrupt politician effect ( before softcaps )"},
        },
        85: {
            title: "Extra Money",
            description: "Gain 10x more shares",
            cost() { 
                if(player.com.first && !player.cap.first) return new Decimal("1e1.75e12")
                return new Decimal("1e1.15e12") 
            },
            unlocked() { return hasUpgrade("cap", 14) || hasUpgrade("m", 85) },
        },
    },
    buyables: {
        11: {
            title: "Electric Powering",
            display() {
                if(hasUpgrade("w", 24)) {
                    if(hasUpgrade("w", 23)) { 
                        return "Boosts electricity gain by " + format(tmp.m.buyables[11].effect) + "x and divides battery cost by " + format(tmp.m.buyables[11].effect) + "x<br>Cost : " + format(new Decimal("1e50").tetrate(getBuyableAmount("m", 11).div(2000).add(1))) + " money" 
                    }
                    return "Boosts electricity gain by " + format(tmp.m.buyables[11].effect) + "x and divides battery cost by " + format(tmp.m.buyables[11].effect) + "x<br>Cost : " + format(new Decimal("1e50").tetrate(getBuyableAmount("m", 11).div(1000).add(1))) + " money"
                }
                if(hasUpgrade("w", 23)) { 
                    return "Boosts electricity gain by " + format(tmp.m.buyables[11].effect) + "x<br>Cost : " + format(new Decimal("1e50").tetrate(getBuyableAmount("m", 11).div(2000).add(1))) + " money" 
                }
                return "Boosts electricity gain by " + format(tmp.m.buyables[11].effect) + "x<br>Cost : " + format(new Decimal("1e50").tetrate(getBuyableAmount("m", 11).div(1000).add(1))) + " money"
            },
            unlocked() { return inChallenge("w", 12) || hasChallenge("w", 12) },
            canAfford() { 
                if(hasUpgrade("w", 23)) { return player.m.points.gte(new Decimal("1e50").tetrate(getBuyableAmount("m", 11).div(2000).add(1))) }
                return player.m.points.gte(new Decimal("1e50").tetrate(getBuyableAmount("m", 11).div(1000).add(1))) 
            },
            buy() { 
                if(hasUpgrade("w", 23)) {
                    player.m.points = player.m.points.minus(new Decimal("1e50").tetrate(getBuyableAmount("m", 11).div(2000).add(1)))
                }
                else {
                    player.m.points = player.m.points.minus(new Decimal("1e50").tetrate(getBuyableAmount("m", 11).div(1000).add(1)))
                }
                setBuyableAmount("m", 11, getBuyableAmount("m", 11).add(1))
            },
            effect() { 
                eff = new Decimal("1e10").pow(getBuyableAmount("m", 11))
                eff = eff.pow(tmp.m.buyables[21].effect)
                if(inChallenge("n", 12)) {
                    eff = new Decimal(1)
                }
                return eff
            }
        },
        12: {
            title: "Cost Reducer",
            display() {
                return "Divides battery cost by " + format(tmp.m.buyables[12].effect.pow(250)) + "x and divides coal power plant cost by " + format(tmp.m.buyables[12].effect) + "<br>Cost : " + format(new Decimal("1e25").tetrate(getBuyableAmount("m", 12).div(100).add(1))) + " money"
            },
            unlocked() { return hasUpgrade("c", 15) },
            canAfford() { 
                return player.m.points.gte(new Decimal("1e25").tetrate(getBuyableAmount("m", 12).div(100).add(1)))
            },
            buy() { 
                player.m.points = player.m.points.minus(new Decimal("1e25").tetrate(getBuyableAmount("m", 12).div(100).add(1)))
                setBuyableAmount("m", 12, getBuyableAmount("m", 12).add(1))
            },
            effect() { 
                if(inChallenge("n", 12)) {
                    return new Decimal(1)
                }
                return new Decimal("1e10").pow(getBuyableAmount("m", 12).pow(2))
            }
        },
        13: {
            title: "Exponent Booster",
            display() {
                return "Add " + format(tmp.m.buyables[13].effect) + "  to the money effect exponent<br>Cost : " + format(new Decimal(10).tetrate(getBuyableAmount("m", 13).div(10).add(1))) + " money"
            },
            unlocked() { return hasChallenge("n", 11) },
            canAfford() { 
                return player.m.points.gte(new Decimal(10).tetrate(getBuyableAmount("m", 13).div(10).add(1)))
            },
            buy() { 
                player.m.points = player.m.points.minus(new Decimal(10).tetrate(getBuyableAmount("m", 13).div(10).add(1)))
                setBuyableAmount("m", 13, getBuyableAmount("m", 13).add(1))
            },
            effect() {
                if(inChallenge("n", 12)) {
                    return new Decimal(0)
                }
                return new Decimal(getBuyableAmount("m", 13).pow(0.5).times(100)) 
            }
        },
        21: {
            title: "Electric Powering 2nd Generation",
            display() {
                return "Electric Powering is raised to the " + format(tmp.m.buyables[21].effect) + "th power<br>Cost : " + format(new Decimal(getBuyableAmount("m", 21)).tetrate(getBuyableAmount("m", 21).div(4).add(1))) + " money"
            },
            unlocked() { return hasUpgrade("b", 52) },
            canAfford() { 
                return player.m.points.gte(new Decimal(getBuyableAmount("m", 21)).tetrate(getBuyableAmount("m", 21).div(4).add(1)))
            },
            buy() { 
                player.m.points = player.m.points.minus(new Decimal(getBuyableAmount("m", 21)).tetrate(getBuyableAmount("m", 21).div(4).add(1)))
                setBuyableAmount("m", 21, getBuyableAmount("m", 21).add(1))
            },
            effect() {
                eff = new Decimal(getBuyableAmount("m", 21).add(1).pow(5))
                return eff
            }
        },
    },
})
addLayer("b", {
    tabFormat: {
        "Main":{
            content: [
                "main-display",
                "prestige-button"
            ],
        },
        "Upgrades":{
            content: [
                "main-display",
                "upgrades"
            ],
        },
        "Milestones":{
            content: [
                "main-display",
                "milestones"
            ],
            unlocked() { return hasMilestone("b", 0) }
        },
        "Buyables":{
            content: [
                "main-display",
                "buyables"
            ],
            unlocked() { return tmp.b.buyables[11].unlocked }
        },
        "Softcaps":{
            content: [
                "main-display",
                ["display-text", function() { 
                    let text = ""
                    if(player.b.best.gte(20)) text = text + "20 Batteries : Base Cost Exp 1.25 --> 1.3<br><br>"
                    if(player.b.best.gte(35)) text = text + "35 Batteries : Base Cost Exp 1.3 --> 1.35<br><br>"
                    if(player.b.best.gte(50)) text = text + "50 Batteries : Base Cost Exp 1.35 --> 1.4<br><br>"
                    if(player.b.best.gte(65)) text = text + "65 Batteries : Base Cost Exp 1.4 --> 1.5<br><br>"
                    if(player.b.best.gte(75)) text = text + "75 Batteries : Base Cost Exp 1.5 --> 1.6<br><br>"
                    if(player.b.best.gte(85)) text = text + "85 Batteries : Base Cost Exp 1.6 --> 1.75<br><br>"
                    if(player.b.best.gte(100)) text = text + "100 Batteries : Base Cost Exp 1.75 --> 1.85<br><br>"
                    if(player.b.best.gte(150)) text = text + "150 Batteries : Base Cost Exp 1.85 --> 2<br><br>"
                    if(player.b.best.gte(200)) text = text + "200 Batteries : Base Cost Exp 2 --> 2.5<br><br>"
                    if(player.b.best.gte(220)) text = text + "220 Batteries : Base Cost Exp 2.5 --> 3<br><br>"
                    if(player.b.best.gte(250)) text = text + "250 Batteries : Base Cost Exp 3 --> 3.5<br><br>"
                    if(player.b.best.gte(300)) text = text + "300 Batteries : Base Cost Exp 3.5 --> 3.75<br><br>"
                    if(player.b.best.gte(320)) text = text + "320 Batteries : Base Cost Exp 3.75 --> 3.8<br><br>"
                    if(player.b.best.gte(365)) text = text + "365 Batteries : Base Cost Exp 3.8 --> 3.85<br><br>"
                    if(player.b.best.gte(399)) text = text + "399 Batteries : Base Cost Exp 3.85 --> 3.8647<br><br>"
                    if(player.b.best.gte(400)) text = text + "400 Batteries : Base Cost Exp 3.8647 --> 4.5<br><br>"
                    if(player.b.best.gte(425)) text = text + "425 Batteries : Base Cost Exp 4.5 --> 5<br><br>"
                    if(player.b.best.gte(450)) text = text + "450 Batteries : Base Cost Exp 5 --> 5.5<br><br>"
                    if(player.b.best.gte(470)) text = text + "470 Batteries : Base Cost Exp 5.5 --> 6.25<br><br>"
                    if(player.b.best.gte(500)) text = text + "500 Batteries : Base Cost Exp 6.25 --> 7<br><br>"
                    if(player.b.best.gte(600)) text = text + "600 Batteries : Base Cost Exp 7 --> 7.25<br><br>"
                    if(player.b.best.gte(700)) text = text + "700 Batteries : Base Cost Exp 7.25 --> 7.5<br><br>"
                    if(player.b.best.gte(800)) text = text + "800 Batteries : Base Cost Exp 7.5 --> 7.75<br><br>"
                    if(player.b.best.gte(900)) text = text + "900 Batteries : Base Cost Exp 7.75 --> 8<br><br>"
                    if(player.b.best.gte(1000)) text = text + "1000 Batteries : Base Cost Exp 8 --> 8.5<br><br>"
                    if(player.b.best.gte(2000)) text = text + "2000 Batteries : Base Cost Exp 8.5 --> 10<br><br>"
                    if(player.b.best.gte(2500)) text = text + "2500 Batteries : Base Cost Exp 10 --> 11.5<br><br>"
                    if(player.b.best.gte(2800)) text = text + "2800 Batteries : Base Cost Exp 11.5 --> 12<br><br>"
                    if(player.b.best.gte(3000)) text = text + "3000 Batteries : Base Cost Exp 12 --> 13<br><br>"
                    if(player.b.best.gte(4000)) text = text + "4000 Batteries : Base Cost Exp 13 --> 14<br><br>"
                    if(player.b.best.gte(5000)) text = text + "5000 Batteries : Base Cost Exp 14 --> 16.5<br><br>"
                    if(player.b.best.gte(6000)) text = text + "6000 Batteries : Base Cost Exp 16.5 --> 17.5<br><br>"
                    if(player.b.best.gte(7000)) text = text + "7000 Batteries : Base Cost Exp 17.5 --> 18.5<br><br>"
                    if(player.b.best.gte(8000)) text = text + "8000 Batteries : Base Cost Exp 18.5 --> 19.5<br><br>"
                    if(player.b.best.gte(9000)) text = text + "9000 Batteries : Base Cost Exp 19.5 --> 20.5<br><br>"
                    if(player.b.best.gte(10000)) text = text + "10000 Batteries : Base Cost Exp 20.5 --> 25<br><br>"
                    return text
                },]
            ],
            unlocked() { return player.b.best.gte(20) }
        },
    },
    name: "batteries", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "B", // This appears on the layer's node. Default is the id with the first letter capitalized
    row: 1, // Row the layer is in on the tree (0 is the first row)
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    color: "#cfc8d8",
	branches: ["m"],
    hotkeys: [
        {key: "b", description: "Press B to Battery Reset", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return player.m.points.gte(25000) || player.b.unlocked},
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
        best: new Decimal(0),
        total: new Decimal(0),
        first: 0,
        auto: false,
        pseudoUpgs: [],
    }},
    requires() { return new Decimal(1000000) }, // Can be a function that takes requirement increases into account
    resource: "batteries", // Name of prestige currency
    baseResource: "money", // Name of resource prestige is based on
    baseAmount() {return player.m.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent() { // Prestige currency exponent
        exp = new Decimal(1.25)
        if(player.b.points.gte(20)) exp = exp.add(0.05)
        if(player.b.points.gte(35)) exp = exp.add(0.05)
        if(player.b.points.gte(50)) exp = exp.add(0.05)
        if(player.b.points.gte(65)) exp = exp.add(0.1)
        if(player.b.points.gte(75)) exp = exp.add(0.1)
        if(player.b.points.gte(85)) exp = exp.add(0.15)
        if(player.b.points.gte(100)) exp = exp.add(0.1)
        if(player.b.points.gte(150)) exp = exp.add(0.15)
        if(player.b.points.gte(200)) exp = exp.add(0.5)
        if(player.b.points.gte(220)) exp = exp.add(0.5)
        if(player.b.points.gte(250)) exp = exp.add(0.5)
        if(player.b.points.gte(300)) exp = exp.add(0.25)
        if(player.b.points.gte(320)) exp = exp.add(0.05)
        if(player.b.points.gte(365)) exp = exp.add(0.05)
        if(player.b.points.gte(399)) exp = exp.add(0.0147)
        if(player.b.points.gte(400)) exp = exp.add(0.6353)
        if(player.b.points.gte(425)) exp = exp.add(0.5)
        if(player.b.points.gte(450)) exp = exp.add(0.5)
        if(player.b.points.gte(470)) exp = exp.add(0.75)
        if(player.b.points.gte(500)) exp = exp.add(0.75)
        if(player.b.points.gte(600)) exp = exp.add(0.25)
        if(player.b.points.gte(700)) exp = exp.add(0.25)
        if(player.b.points.gte(800)) exp = exp.add(0.25)
        if(player.b.points.gte(900)) exp = exp.add(0.25)
        if(player.b.points.gte(1000)) exp = exp.add(0.5)
        if(player.b.points.gte(2000)) exp = exp.add(1.5)
        if(player.b.points.gte(2500)) exp = exp.add(1.5)
        if(player.b.points.gte(2800)) exp = exp.add(0.5)
        if(player.b.points.gte(3000)) exp = exp.add(1)
        if(player.b.points.gte(4000)) exp = exp.add(1)
        if(player.b.points.gte(5000)) exp = exp.add(2.5)
        if(player.b.points.gte(6000)) exp = exp.add(1)
        if(player.b.points.gte(7000)) exp = exp.add(1)
        if(player.b.points.gte(8000)) exp = exp.add(1)
        if(player.b.points.gte(9000)) exp = exp.add(1)
        if(player.b.points.gte(10000)) exp = exp.add(4.5)
        if(hasUpgrade("b", 55)) exp = exp.minus(0.1)
        if(hasUpgrade("w", 43)) exp = exp.minus(0.925)
        if(hasUpgrade("c", 13)) exp = exp.minus(1)
        if(hasUpgrade("n", 13)) exp = exp.minus(tmp.n.upgrades[13].effect)
        exp = exp.minus(tmp.b.buyables[11].effect)
        if(inChallenge("n", 11)) exp = exp.add(new Decimal(0.01).times(player.b.upgrades.length))
        if(inChallenge("s", 12)) {
            if(getBuyableAmount("p", 22).eq(1)) exp = exp.add(0.025)
        }
        if(hasUpgrade("w", 52)) exp = exp.div(tmp.w.upgrades[52].effect)
        return exp
    },
	base() {
        base = new Decimal(10)
        base = base.minus(tmp.b.buyables[13].effect)
        if(inChallenge("s", 12)) {
            if(getBuyableAmount("p", 12).eq(1)) base = base.minus(2.5).max(2)
        }
        if(hasUpgrade("b", 54)) base = base.minus(1).div(250000000).add(1)
        if(hasUpgrade("cb", 25)) base = base.pow(0.001)
        return base
    },
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
		if(hasUpgrade("b", 12)) {
			if(hasUpgrade("b", 15)) {mult = mult.div(tmp.b.effect.pow(2))}
			mult = mult.div(tmp.b.effect)
		}
		if(hasUpgrade("m", 24)) {
            if(hasUpgrade("m", 42)) {mult = mult.div(tmp.m.effect.pow(0.5))}
            mult = mult.div(tmp.m.effect.pow(0.5))
        }
		if(hasUpgrade("b", 23)) {mult = mult.div(tmp.b.upgrades[23].effect)}
        if(hasUpgrade("w", 24)) {mult = mult.div(tmp.m.buyables[11].effect)}
        if(hasUpgrade("b", 41)) {mult = mult.div(tmp.b.upgrades[41].effect)}
        if(hasUpgrade("w", 35)) {mult = mult.div(new Decimal("1e695"))}
        if(hasChallenge("n", 12)) {mult = mult.div(tmp.n.effect.pow(10000))}
        if(hasUpgrade("m", 53)) {mult = mult.div(tmp.m.upgrades[53].effect)}
        mult = mult.div(tmp.m.buyables[12].effect.pow(250))
        mult = mult.div(tmp.s.effect.pow(1000))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        exp = new Decimal(1)
        return exp
    },
	effect() {
        if(inChallenge("s", 11)) {
            return new Decimal(1)
        }
		eff = new Decimal(2)
	    if(hasUpgrade("b", 11)) {eff = eff.add(tmp.b.upgrades[11].effect)}
		if(hasUpgrade("b", 13)) {eff = eff.add(tmp.b.upgrades[13].effect)}
		if(hasUpgrade("b", 14)) {eff = eff.add(tmp.b.upgrades[14].effect)}
		if(hasUpgrade("b", 25)) {eff = eff.add(tmp.b.upgrades[25].effect)}
        eff = eff.times(tmp.b.buyables[12].effect)
		if(hasUpgrade("b", 21)) {eff = eff.pow(tmp.b.upgrades[21].effect)}
		if(hasUpgrade("w", 14)) {eff = eff.pow(tmp.w.upgrades[14].effect)}
        if(hasUpgrade("m", 35)) {eff = eff.pow(1.1)}
        if(hasUpgrade("b", 51)) {eff = eff.pow(1.1)}
        if(hasUpgrade("b", 33)) {
            if(hasUpgrade("b", 44)) {eff = eff.pow(3)}
            eff = eff.pow(3)
        }
        if(hasUpgrade("i", 45)) eff = eff.pow(player.b.points.pow(tmp.i.upgrades[45].effect))
		else eff = eff.pow(player.b.points)
        if(inChallenge("w", 12)) {eff = new Decimal(1)}
		return eff
	},
	effectDescription() {
        if(inChallenge("w", 12)) { return }
		if(hasUpgrade("b", 12)) {
			if(hasUpgrade("b", 15)) {return "Which Are Boosting Electricity Gain By "+format(tmp.b.effect)+"x And Dividing Battery Cost By "+format(tmp.b.effect.pow(3))+"x"}
			return "Which Are Boosting Electricity Gain By "+ format(tmp.b.effect)+"x And Dividing Battery Cost By "+format(tmp.b.effect)+"x"
		}
		return "Which Are Boosting Electricity Gain By "+format(tmp.b.effect)+"x"
	},
	resetsNothing() { return hasMilestone("w", 0) },
    autoPrestige() { return hasMilestone("c", 0) },
    canBuyMax() { return hasMilestone("c", 0) && !inChallenge("n", 21) },
    doReset(resettingLayer){
        let keep = []
        if (hasMilestone("c", 2)) keep.push("milestones")
        if (hasMilestone("n", 0)) keep.push("upgrades")
        if(hasMilestone("sh", 5)) keep.push("buyables")
        if (layers[resettingLayer].row > this.row) layerDataReset(this.layer, keep)
    },
    upgrades: {
		11:{
            title: "Bigger Batteries",
            description: "Buy bigger batteries",
            cost() { return new Decimal(2) },
            onPurchase() {
                if(hasMilestone("b", 2)) {player.b.points = player.b.points.add(this.cost)}
            },
            unlocked() { return player.b.best.gte(1) || hasUpgrade("b", 11) },
            effect() {
                return new Decimal(player.m.points.add(1).log10().add(1).log10().pow(0.5))
            },
            effectDisplay() { return "+" + format(tmp.b.upgrades[11].effect) + " to battery effect base" },
		},
		12:{
            title: "Cost Decrease",
            description: "Battery effect decreases battery cost",
            cost() { return new Decimal(8) },
            onPurchase() {
                if(hasMilestone("b", 2)) {player.b.points = player.b.points.add(this.cost)}
            },
            unlocked() { return player.b.best.gte(5) || hasUpgrade("b", 12) },
		},
		13:{
            title: "Battery Extender",
            description: "Batteries last longer and stock more electricity",
            cost() { return new Decimal(13) },
            onPurchase() {
                if(hasMilestone("b", 2)) {player.b.points = player.b.points.add(this.cost)}
            },
            unlocked() { return hasUpgrade("b", 12) || hasUpgrade("b", 13) },
            effect() {
                return new Decimal(player.b.points.add(1).log10().pow(2))
            },
            effectDisplay() { return "+" + format(tmp.b.upgrades[13].effect) + " to battery effect base" },
		},
		14:{
            title: "Hire Technicians",
            description: "Hire technicians to boost battery effect",
            cost() { return new Decimal(22) },
            onPurchase() {
                if(hasMilestone("b", 2)) {player.b.points = player.b.points.add(this.cost)}
            },
            unlocked() { return hasUpgrade("m", 23) || hasUpgrade("b", 14) },
            effect() {
                return new Decimal(player.m.points.add(1).log10().add(1).log10().pow(3))
            },
            effectDisplay() { return "+" + format(tmp.b.upgrades[14].effect) + " to battery effect base" },
		},
		15:{
            title: "Cost Decrease Part 2",
            description: "Battery effect reduces battery cost even more",
            cost() { return new Decimal(35) },
            onPurchase() {
                if(hasMilestone("b", 2)) {player.b.points = player.b.points.add(this.cost)}
            },
            unlocked() { return hasUpgrade("m", 31) || hasUpgrade("b", 15) },
		},
		21:{
            title: "More Effects",
            description: "Boost battery effect based on batteries",
            cost() { return new Decimal(64) },
            unlocked() { return hasUpgrade("m", 31) || hasUpgrade("b", 21) },
            onPurchase() {
                if(hasMilestone("b", 2)) {player.b.points = player.b.points.add(this.cost)}
            },
            effect() {
                return new Decimal(player.b.points.add(1).log10().add(1).min(3))
            },
            effectDisplay() { return "^" + format(tmp.b.upgrades[21].effect) + " to battery effect" },
		},
		22:{
            title: "Workers",
            description: "Unlock the worker layer",
            cost() { return new Decimal(85) },
            onPurchase() {
                if(hasMilestone("b", 2)) {player.b.points = player.b.points.add(this.cost)}
            },
            unlocked() { return hasUpgrade("m", 31) || hasUpgrade("b", 22) },
		},
		23:{
            title: "Lowering Costs",
            description: "Batteries cost less based on money",
            cost() { return new Decimal(85) },
            onPurchase() {
                if(hasMilestone("b", 2)) {player.b.points = player.b.points.add(this.cost)}
            },
            unlocked() { return hasUpgrade("m", 32) || hasUpgrade("b", 23) },
            effect() {
                return new Decimal(player.m.points.pow(3).add(1))
            },
            effectDisplay() { return "/" + format(tmp.b.upgrades[23].effect) + " battery cost" },
		},
		24:{
            title: "Worker Boost",
            description: "Batteries boost worker gain",
            cost() { return new Decimal(100) },
            onPurchase() {
                if(hasMilestone("b", 2)) {player.b.points = player.b.points.add(this.cost)}
            },
            unlocked() { return hasUpgrade("m", 32) || hasUpgrade("b", 24) },
            effect() {
                return new Decimal(player.b.points.add(1).log10().add(1).pow(4))
            },
            effectDisplay() { return "*" + format(tmp.b.upgrades[24].effect) + " to worker gain" },
		},
		25:{
            title: "Base Booster",
            description: "Batteries boost battery base",
            cost() { return new Decimal(120) },
            onPurchase() {
                if(hasMilestone("b", 2)) {player.b.points = player.b.points.add(this.cost)}
            },
            unlocked() { return hasUpgrade("m", 32) || hasUpgrade("b", 25) },
            effect() {
                return new Decimal(player.b.points)
            },
            effectDisplay() { return "+" + format(tmp.b.upgrades[25].effect) + " to battery effect base" },
		},
        31:{
            title: "Hardwork++",
            description: "Raise Hardwork cap to 2.5",
            cost() { return new Decimal(150) },
            onPurchase() {
                if(hasMilestone("b", 2)) {player.b.points = player.b.points.add(this.cost)}
            },
            unlocked() { return hasUpgrade("w", 22) || hasUpgrade("b", 31) },
		},
        32:{
            title: "Maintenance",
            description: "Batteries need maitenance, hire more workers to take care of them",
            cost() { return new Decimal(163) },
            onPurchase() {
                if(hasMilestone("b", 2)) {player.b.points = player.b.points.add(this.cost)}
            },
            unlocked() { return hasUpgrade("w", 22) || hasUpgrade("b", 32) },
            effect() {
                return new Decimal(player.b.points.pow(3).add(1))
            },
            effectDisplay() { return "*" + format(tmp.b.upgrades[32].effect) + " to worker gain"},
		},
        33:{
            title: "Overcharge",
            description: "Overcharge your batteries, which cubes their effect",
            cost() { return new Decimal(164) },
            onPurchase() {
                if(hasMilestone("b", 2)) {player.b.points = player.b.points.add(this.cost)}
            },
            unlocked() { return hasUpgrade("w", 22) || hasUpgrade("b", 33) },
		},
        34:{
            title: "Overcharge+",
            description: "Overcharge effect also raises worker effect to the 15th power",
            cost() { return new Decimal(200) },
            onPurchase() {
                if(hasMilestone("b", 2)) {player.b.points = player.b.points.add(this.cost)}
            },
            unlocked() { return hasUpgrade("w", 22) || hasUpgrade("b", 34) },
		},
        35:{
            title: "New Horizons",
            description: "Unlock a new layer",
            cost() { return new Decimal(200) },
            onPurchase() {
                if(hasMilestone("b", 2)) {player.b.points = player.b.points.add(this.cost)}
            },
            unlocked() { return hasUpgrade("w", 22) || hasUpgrade("b", 35) },
		},
        41:{
            title: "Flat Decrease",
            description: "Divides the battery cost",
            cost() { return new Decimal(250) },
            onPurchase() {
                if(hasMilestone("b", 2)) {player.b.points = player.b.points.add(this.cost)}
            },
            unlocked() { return hasUpgrade("m", 45) || hasUpgrade("b", 41) },
            effect() {
                return new Decimal("1e200000")
            },
            effectDisplay() { return "/" + format(tmp.b.upgrades[41].effect) + " to battery cost"}
		},
        42:{
            title: "Network+",
            description: "Cube Network's effect",
            cost() { return new Decimal(254) },
            onPurchase() {
                if(hasMilestone("b", 2)) {player.b.points = player.b.points.add(this.cost)}
            },
            unlocked() { return hasUpgrade("m", 45) || hasUpgrade("b", 42) },
		},
        43:{
            title: "Workforce",
            description: "Each battery doubles worker gain",
            cost() { return new Decimal(300) },
            onPurchase() {
                if(hasMilestone("b", 2)) {player.b.points = player.b.points.add(this.cost)}
            },
            unlocked() { return hasUpgrade("m", 45) || hasUpgrade("b", 43) },
            effect() {
                return new Decimal(2).pow(player.b.points)
            },
            effectDisplay() { return "*" + format(tmp.b.upgrades[43].effect) + " to worker gain"}
		},
        44:{
            title: "Overcharge++",
            description: "Battery overcharge cubes battery effect again",
            cost() { return new Decimal(366) },
            onPurchase() {
                if(hasMilestone("b", 2)) {player.b.points = player.b.points.add(this.cost)}
            },
            unlocked() { return hasUpgrade("m", 45) || hasUpgrade("b", 44) },
		},
        45:{
            title: "Deja Vu",
            description: "Unlock a new layer",
            cost() { return new Decimal(400) },
            onPurchase() {
                if(hasMilestone("b", 2)) {player.b.points = player.b.points.add(this.cost)}
            },
            unlocked() { return hasUpgrade("m", 45) || hasUpgrade("b", 45) },
		},
        51: {
            title: "More Battery Power",
            description: "Battery effect is raised to the 1.1th power",
            cost() { return new Decimal(3580) },
            onPurchase() {
                if(hasMilestone("b", 2)) {player.b.points = player.b.points.add(this.cost)}
            },
            unlocked() { return hasUpgrade("sh", 15) || hasUpgrade("b", 51) },
        },
        52: {
            title: "Purchase Stuff",
            description: "Add a 4th money buyable",
            cost() { return new Decimal(4070) },
            onPurchase() {
                if(hasMilestone("b", 2)) {player.b.points = player.b.points.add(this.cost)}
            },
            unlocked() { return hasUpgrade("sh", 15) || hasUpgrade("b", 52) },
        },
        53: {
            title: "Solar Batteries",
            description: "Batteries reduce solar power plant cost",
            cost() { return new Decimal(4550) },
            onPurchase() {
                if(hasMilestone("b", 2)) {player.b.points = player.b.points.add(this.cost)}
            },
            unlocked() { return hasUpgrade("sh", 15) || hasUpgrade("b", 53) },
            effect() {
                eff = new Decimal(player.b.points).add(1).log10().minus(2.5).max(1)
                return eff
            },
            effectDisplay() { return "/" + format(tmp.b.upgrades[53].effect) + " to solar power plant cost"}
        },
        54: {
            title: "Sheeper Batteries",
            description: "Yes it is intended, bear with it<br>Battery cost base is divided by 250,000,000",
            cost() { return new Decimal(5000) },
            onPurchase() {
                if(hasMilestone("b", 2)) {player.b.points = player.b.points.add(this.cost)}
            },
            unlocked() { return hasUpgrade("sh", 15) || hasUpgrade("b", 54) },
        },
        55: {
            title: "The 15th One",
            description: "Battery cost exponent is reduced by 0.1",
            cost() { return new Decimal(5910) },
            onPurchase() {
                if(hasMilestone("b", 2)) {player.b.points = player.b.points.add(this.cost)}
            },
            unlocked() { return hasUpgrade("sh", 15) || hasUpgrade("b", 55) },
        },
    },
    buyables: {
        11: {
            title: "Exponent Crusher",
            display() {
                if(hasUpgrade("m", 62)) {
                    return "Reduces battery cost exponent by " + format(tmp.b.buyables[11].effect) + "<br>Cost : " + format(new Decimal(5).add(getBuyableAmount("b", 11).pow(0.5)).times(getBuyableAmount("b", 11).add(1).pow(getBuyableAmount("b", 11).gte(516) ? 0.8:0.75)).floor()) + " batteries"
                }
                return "Reduces battery cost exponent by " + format(tmp.b.buyables[11].effect) + "<br>Cost : " + format(new Decimal(5).add(getBuyableAmount("b", 11).pow(0.5)).times(getBuyableAmount("b", 11).add(1).pow(getBuyableAmount("b", 11).gte(516) ? 1.05:1)).floor()) + " batteries"
            },
            unlocked() { return hasUpgrade("w", 33) },
            canAfford() { 
                if(hasUpgrade("m", 62)) {
                    return player.b.points.gte(new Decimal(5).add(getBuyableAmount("b", 11).pow(0.5)).times(getBuyableAmount("b", 11).add(1).pow(getBuyableAmount("b", 11).gte(516) ? 0.8:0.75)).floor())
                }
                return player.b.points.gte(new Decimal(5).add(getBuyableAmount("b", 11).pow(0.5)).times(getBuyableAmount("b", 11).add(1).pow(getBuyableAmount("b", 11).gte(516) ? 1.05:1)).floor())
            },
            buy() {
                if(!hasMilestone("b", 2)) {
                    if(hasUpgrade("m", 62)) {
                        player.b.points = player.b.points.minus(new Decimal(5).add(getBuyableAmount("b", 11).pow(0.5)).times(getBuyableAmount("b", 11).add(1).pow(getBuyableAmount("b", 11).gte(516) ? 0.8:0.75)).floor())
                    }
                    else {
                        player.b.points = player.b.points.minus(new Decimal(5).add(getBuyableAmount("b", 11).pow(0.5)).times(getBuyableAmount("b", 11).add(1).pow(getBuyableAmount("b", 11).gte(516) ? 1.05:1)).floor())
                    }
                }
                setBuyableAmount("b", 11, getBuyableAmount("b", 11).add(1))
            },
            effect() {
                eff = new Decimal(0.01).times(getBuyableAmount("b", 11).times(tmp.b.buyables[21].effect).add(tmp.b.buyables[13].effect.add(1).pow(5)))
                if(hasUpgrade("w", 34)) {eff = eff.times(1.1)}
                if(eff.gte(5)) eff = eff.minus(4).pow(0.8).add(4)
                if(eff.gte(6.5)) eff = eff.minus(5.5).pow(1/20).add(5.5)
                if(inChallenge("n", 12)) {
                    eff = new Decimal(0)
                }
                return eff
            }
        },
        12: {
            title: "Effect Booster",
            display() {
                return "Multiply battery effect base by " + format(tmp.b.buyables[12].effect) + "<br>Cost : " + format(new Decimal(25).add(getBuyableAmount("b", 12).pow(2/3)).times(getBuyableAmount("b", 12).add(1)).floor()) + " batteries"
            },
            unlocked() { return hasUpgrade("m", 51) },
            canAfford() { 
                return player.b.points.gte(new Decimal(25).add(getBuyableAmount("b", 12).pow(2/3)).times(getBuyableAmount("b", 12).add(1)).floor())
            },
            buy() {
                if(!hasMilestone("b", 2)) {
                    player.b.points = player.b.points.minus(new Decimal(25).add(getBuyableAmount("b", 12).pow(2/3)).times(getBuyableAmount("b", 12).add(1)).floor())
                }
                setBuyableAmount("b", 12, getBuyableAmount("b", 12).add(1))
            },
            effect() {
                eff = new Decimal(1).add(getBuyableAmount("b", 12).times(tmp.b.buyables[21].effect).pow(5))
                if(inChallenge("n", 12)) {
                    eff = new Decimal(1)
                }
                return eff
            }
        },
        13: {
            title: "Base Smasher",
            display() { return "Reduces battery base by " + format(tmp.b.buyables[13].effect) + " and add " + format(tmp.b.buyables[13].effect.add(1).pow(5)) + " free levels to Exponent Crusher<br>Cost : " + format(new Decimal(2000).add(getBuyableAmount("b", 13).pow(getBuyableAmount("b", 13).gte(5) ? 2.5:1.5).times(100)).floor()) + " batteries" },
            unlocked() { return hasUpgrade("p", 33) },
            canAfford() { 
                return player.b.points.gte(new Decimal(2000).add(getBuyableAmount("b", 13).pow(getBuyableAmount("b", 13).gte(5) ? 2.5:1.5).times(100)).floor())
            },
            buy() {
                if(!hasMilestone("b", 2)) {
                    player.b.points = player.b.points.minus(new Decimal(2000).add(getBuyableAmount("b", 13).pow(getBuyableAmount("b", 13).gte(5) ? 2.5:1.5).times(100)).floor())
                }
                setBuyableAmount("b", 13, getBuyableAmount("b", 13).add(1))
            },
            effect() {
                eff = getBuyableAmount("b", 13).times(tmp.b.buyables[21].effect).times(8).div(getBuyableAmount("b", 13).times(tmp.b.buyables[21].effect).add(25))
                return eff
            }
        },
        21: {
            title: "Buyable Boost",
            display() { return "Boost all previous buyables by " + format(tmp.b.buyables[21].effect.times(100)) + "  %<br>Cost : " + format(new Decimal(2500).add(getBuyableAmount("b", 21).pow(7/3).times(25)).floor()) + " batteries" },
            unlocked() { return hasUpgrade("m", 71) },
            canAfford() { 
                return player.b.points.gte(new Decimal(2500).add(getBuyableAmount("b", 21).pow(7/3).times(25)).floor())
            },
            buy() {
                if(!hasMilestone("b", 2)) {
                    player.b.points = player.b.points.minus(new Decimal(2500).add(getBuyableAmount("b", 21).pow(7/3).times(25)).floor())
                }
                setBuyableAmount("b", 21, getBuyableAmount("b",21).add(1))
            },
            effect() {
                eff = new Decimal(1)
                eff = eff.add(getBuyableAmount("b", 21).times(hasUpgrade("m", 75) ? 25000:1).pow(0.5).div(25))
                eff.min(1.5)
                return eff
            }
        },
    },
	milestones: {
		0: {
			requirementDescription: "5 Batteries",
			done() { return player.b.best.gte(5) },
			effectDescription: "Keep money upgrades on reset",
		},
		1: {
			requirementDescription: "10 Batteries",
			done() { return player.b.best.gte(10) },
			effectDescription: "Gain 100% of money on reset every second",
		},
        2: {
			requirementDescription: "25 Batteries",
			done() { return player.b.best.gte(25) },
			effectDescription() {
                if(hasUpgrade("w", 33)) { return "Buying battery upgrades/buyables doesn't decrease your battery amount"}
                return "Buying battery upgrades doesn't decrease your battery amount"
            },
		},
	},
})
addLayer("w", {
    tabFormat: {
        "Main":{
            content: [
                "main-display",
                "prestige-button"
            ],
        },
        "Upgrades":{
            content: [
                "main-display",
                "upgrades"
            ],
        },
        "Milestones":{
            content: [
                "main-display",
                "milestones"
            ],
            unlocked() { return hasMilestone("w", 0) }
        },
        "Challenges":{
            content: [
                "main-display",
                "challenges"
            ],
            unlocked() { return tmp.w.challenges[11].unlocked }
        },
    },
    name: "worker", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "W", // This appears on the layer's node. Default is the id with the first letter capitalized
    row: 1, // Row the layer is in on the tree (0 is the first row)
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    color: "#fd4638",
	branches: ["m"],
    hotkeys: [
        {key: "w", description: "Press W to Worker Reset", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return hasUpgrade("b", 22) || player.w.unlocked},
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
        best: new Decimal(0),
        total: new Decimal(0),
        first: 0,
        auto: false,
        pseudoUpgs: [],
    }},
    requires() { return new Decimal("1e390") }, // Can be a function that takes requirement increases into account
    resource: "workers", // Name of prestige currency
    baseResource: "money", // Name of resource prestige is based on
    baseAmount() {return player.m.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent() { // Prestige currency exponent
		exp = new Decimal(0.01)
        if(hasChallenge("w", 22)) {exp = exp.add(0.015)}
        if(inChallenge("s", 12)) {
            if(getBuyableAmount("p", 13).eq(1)) exp = exp.times(4/3)
            if(getBuyableAmount("p", 23).eq(1)) exp = exp.times(new Decimal(1).minus(player.c.points.div(50)))
        }
		return exp
	},
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
		if(hasUpgrade("b", 24)) mult = mult.times(tmp.b.upgrades[24].effect)
        if(hasUpgrade("b", 32)) mult = mult.times(tmp.b.upgrades[32].effect)
        if(hasUpgrade("b", 43)) mult = mult.times(tmp.b.upgrades[43].effect)
        if(hasUpgrade("w", 21)) mult = mult.times(tmp.w.upgrades[21].effect)
        if(hasUpgrade("w", 42)) mult = mult.times(tmp.w.upgrades[42].effect)
        if(hasUpgrade("w", 51)) mult = mult.times(tmp.w.upgrades[51].effect)
        if(hasUpgrade("w", 53)) mult = mult.times(tmp.w.upgrades[53].effect)
        if(hasUpgrade("c", 11)) mult = mult.times(tmp.c.upgrades[11].effect)
        if(hasUpgrade("c", 12)) mult = mult.times(tmp.c.effect)
        if(hasUpgrade("n", 11)) mult = mult.times(tmp.n.upgrades[11].effect)
        if(hasUpgrade("n", 14)) mult = mult.times(tmp.n.upgrades[14].effect)
        if(hasUpgrade("s", 12)) mult = mult.times(tmp.s.upgrades[12].effect)
        if(hasUpgrade("sh", 12)) mult = mult.times(tmp.sh.effect)
        if(inChallenge("n", 11)) mult = mult.div(new Decimal(100).pow(player.w.upgrades.length))
        mult = mult.times(tmp.com.effect)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        exp = new Decimal(1)
        return exp
    },
	effect() {
        if(inChallenge("s", 11)) {
            return new Decimal(1)
        }
		eff = new Decimal(1)
		exp = new Decimal(0.5)
		if(hasUpgrade("w", 12)) {
			eff = player.w.points.add(1).log10().add(1)
			if(hasUpgrade("w", 13)) {exp = exp.times(3)}
			eff = eff.pow(exp)
		}
        if(hasUpgrade("w", 25)) {eff = eff.pow(25)}
        if(hasUpgrade("b", 34)) {eff = eff.pow(15)}
        if(hasUpgrade("w", 32)) {eff = eff.pow(20)}
        if(hasUpgrade("w", 41)) {eff = eff.pow(2500)}
		return eff
	},
	effectDescription() {
		if(hasUpgrade("w", 12)) {return "Which Are Boosting Electricity Gain By "+format(tmp.w.effect)+"x"}
	},
    passiveGeneration() { return hasMilestone("w", 1) },
    doReset(resettingLayer){
        let keep = []
        if (hasMilestone("c", 2)) keep.push("milestones")
        if (hasMilestone("c", 2)) keep.push("challenges")
        if (hasMilestone("sh", 3)) keep.push("upgrades")
        if (layers[resettingLayer].row > this.row) layerDataReset(this.layer, keep)
    },
    upgrades: {
		11:{
            title: "Electricians",
            description: "Workers increase electricity gain",
            cost() { return new Decimal(1) },
            unlocked() { return player.w.best.gte(1) || hasUpgrade("w", 11) },
            effect() {
                return new Decimal(player.w.points.add(2).log10().add(1).pow(15))
            },
            effectDisplay() { return "*" + format(tmp.w.upgrades[11].effect) + " to electricity gain" },
		},
		12:{
            title: "Why Not Another Effect ?",
            description: "Unlock a worker effect",
            cost() { return new Decimal(50) },
            unlocked() { return player.w.best.gte(1) || hasUpgrade("w", 12) },
		},
		13:{
            title: "Better Effect",
            description: "Triple the worker effect exponent",
            cost() { return new Decimal(100) },
            unlocked() { return hasUpgrade("w", 12) || hasUpgrade("w", 13) },
		},
		14:{
            title: "Hardwork",
            description: "Workers boost battery effect",
            cost() { return new Decimal(25000) },
            unlocked() { return hasUpgrade("b", 24) || hasUpgrade("w", 14) },
			effect() {
                if(hasUpgrade("b", 31)) { return new Decimal(player.w.points.add(1).pow(0.035).min(2.5))}
				if(hasUpgrade("w", 15)) { return new Decimal(player.w.points.add(1).pow(0.035).min(1.75))}
				return new Decimal(player.w.points.add(1).pow(0.025).min(1.5))
			},
			effectDisplay() { return "^" + format(tmp.w.upgrades[14].effect) + " battery effect"},
		},
		15:{
            title: "Hardwork+",
            description: "Hardwork is more powerful and has a higher cap",
            cost() { return new Decimal(2500000) },
            unlocked() { return hasUpgrade("w", 14) || hasUpgrade("w", 15) },
		},
        21:{
            title: "Hire Workers",
            description: "Money boosts worker gain",
            cost() { return new Decimal("2.5e18") },
            unlocked() { return hasChallenge("w", 11) || hasUpgrade("w", 21) },
            effect() {
                return new Decimal(player.m.points.add(1).log10().pow(1/3)).max(1)
            },
            effectDisplay() { return "*" + format(tmp.w.upgrades[21].effect) + " to worker gain"}
		},
        22:{
            title: "Keep Upgrading",
            description: "Unlock yet another 5 battery upgrades",
            cost() { return new Decimal("1e20") },
            unlocked() { return hasUpgrade("w", 21) || hasUpgrade("w", 22) },
		},
        23:{
            title: "Lower Scaling",
            description: "Halves the first money buyable scaling",
            cost() { return new Decimal("1e31") },
            unlocked() { return hasChallenge("w", 12) || hasUpgrade("w", 23) },
		},
        24:{
            title: "Buyable Boost",
            description: "First money buyable's effect also reduces battery cost",
            cost() { return new Decimal("1e35") },
            unlocked() { return hasChallenge("w", 12) || hasUpgrade("w", 24) },
		},
        25:{
            title: "Productive Workers",
            description: "Your workers are more productive, raising their effect to the 25th power",
            cost() { return new Decimal("1e48") },
            unlocked() { return hasUpgrade("b", 32) || hasUpgrade("w", 25) },
		},
        31:{
            title: "Network",
            description: "Hire some workers to build a better network between your coal power plants",
            cost() { return new Decimal("1e210") },
            unlocked() { return (hasChallenge("w", 21) && hasUpgrade("c", 14)) || hasUpgrade("w", 31) },
            effect() {
                eff = new Decimal(player.w.points.add(1).log10().div(10).add(1))
                if(hasUpgrade("b", 42)) {eff = eff.pow(3)}
                return eff
            },
            effectDisplay() { return "*" + format(tmp.w.upgrades[31].effect) + " to Self Synergy effect"}
		},
        32:{
            title: "Younger Workers",
            description: "Raise worker effect to the 20th power",
            cost() { return new Decimal("1e4148") },
            unlocked() { return hasUpgrade("m", 45) || hasUpgrade("w", 32) },
		},
        33:{
            title: "Lots Of Buyables",
            description: "Unlock a battery buyable",
            cost() { return new Decimal("1e9840") },
            unlocked() { return hasUpgrade("m", 45) || hasUpgrade("w", 33) },
		},
        34:{
            title: "Better Buyables",
            description: "Boost the first battery buyable's effect by 10%",
            cost() { return new Decimal("1e10000") },
            unlocked() { return hasUpgrade("m", 45) || hasUpgrade("w", 34) },
		},
        35:{
            title: "Small Boost",
            description: "Divides battery cost by 1e695",
            cost() { return new Decimal("1e11632") },
            unlocked() { return hasUpgrade("m", 45) || hasUpgrade("w", 35) },
		},
        41: {
            title: "Get Back To Work",
            description: "Worker effect is raised to the 2500th power",
            cost() { return new Decimal("1e600000000") },
            unlocked() { return hasUpgrade("sh", 15) || hasUpgrade("w", 41) },
        },
        42: {
            title: "Shared Work",
            description: "Shares boost worker gain",
            cost() { return new Decimal("1e1300000000") },
            unlocked() { return hasUpgrade("sh", 15) || hasUpgrade("w", 42) },
            effect() {
                eff = new Decimal(player.sh.points.add(1).log10().add(1).pow(1000000000))
                return eff
            },
            effectDisplay() { return "*" + format(tmp.w.upgrades[42].effect) + " to worker gain"}
        },
        43: {
            title: "Batteries Required",
            description: "Reduce the battery cost exponent by 0.925",
            cost() { return new Decimal("1e2000000000") },
            unlocked() { return hasUpgrade("sh", 15) || hasUpgrade("w", 43) },
        },
        44: {
            title: "Gotta Go Faster",
            description: "Multiply inflation generation speed by 100",
            cost() { return new Decimal("1e3075000000") },
            unlocked() { return hasUpgrade("sh", 15) || hasUpgrade("w", 44) },
        },
        45: {
            title: "Inflated Governments",
            description: "Inflation boosts corrupt government gain",
            cost() { return new Decimal("1e4550000000") },
            unlocked() { return hasUpgrade("sh", 15) || hasUpgrade("w", 45) },
            effect() {
                eff = new Decimal(player.i.points.layer).add(1).pow(10)
                return eff
            },
            effectDisplay() { return "*" + format(tmp.w.upgrades[45].effect) + " to corrupt government gain"}
        },
        51: {
            title: "Shared Work",
            description: "Shares boost worker gain",
            cost() { 
                if(player.cap.first && !player.com.first) return new Decimal("1e35045000000")
                return new Decimal("1e12200000000") 
            },
            unlocked() { return hasUpgrade("com", 13) || hasUpgrade("w", 51) },
            effect() {
                eff = new Decimal(10).pow(player.sh.points.add(1).log10().pow(3))
                return eff
            },
            effectDisplay() { return "*" + format(tmp.w.upgrades[51].effect) + " to worker gain"}
        },
        52: {
            title: "Worker Power",
            description: "Workers divide the battery cost exponent",
            cost() { 
                if(player.cap.first && !player.com.first) return new Decimal("1e54750000000")
                return new Decimal("1e13005000000") 
            },
            unlocked() { return hasUpgrade("com", 13) || hasUpgrade("w", 52) },
            effect() {
                eff = new Decimal(player.w.points.add(1).slog().add(1).pow(0.2))
                return eff
            },
            effectDisplay() { return "/" + format(tmp.w.upgrades[52].effect) + " to battery cost exponent"}
        },
        53: {
            title: "Political Work",
            description: "Corrupt politicians boost worker gain",
            cost() { 
                if(player.cap.first && !player.com.first) return new Decimal("1e65000000000")
                return new Decimal("1e15800000000") 
            },
            unlocked() { return hasUpgrade("com", 13) || hasUpgrade("w", 53) },
            effect() {
                eff = new Decimal(10).pow(player.p.points.add(1).log10().pow(2))
                if(eff.gte("1e100000000")) eff = eff.times("1e100000000").pow(0.5)
                if(eff.gte("1e1000000000")) eff = eff.log10().pow(1000000000/9)
                return eff
            },
            effectDisplay() { return "*" + format(tmp.w.upgrades[53].effect) + " worker gain"}
        },
        54: {
            title: "CO2 Forever",
            description: "Reduce the coal power plant cost exponent by 0.0012",
            cost() { 
                if(player.cap.first && !player.com.first) return new Decimal("1e66125000000")
                return new Decimal("1e16545000000") 
            },
            unlocked() { return hasUpgrade("com", 13) || hasUpgrade("w", 54) },
        },
        55: {
            title: "Last Minute Work",
            description: "Share gain is 1e6x greater",
            cost() { 
                if(player.cap.first && !player.com.first) return new Decimal("1e72000000000")
                return new Decimal("1e18375000000") 
            },
            unlocked() { return hasUpgrade("com", 13) || hasUpgrade("w", 55) },
        },
    },
    challenges: {
		11: {
			name: "Low Demand",
			challengeDescription: "There is a low demand of electricity, making the money gain exponent divide by 2",
			goalDescription: "1e930 money",
			rewardDescription: "Money boosts electricity gain",
			unlocked() { return hasUpgrade("m", 33) || (inChallenge("w", 11) && !inChallenge("w", 21)) || hasChallenge("w", 11) },
			canComplete() { return player.m.points.gte("1e930")},
			rewardEffect() { return player.m.points.pow(0.01).add(1) },
			rewardDisplay() { return "Boost Electricty Gain By "+format(tmp.w.challenges[11].rewardEffect)+"x"}
		},
        12: {
			name: "Power Outage",
			challengeDescription: "There has been a power outage, which removes the battery effect, but you unlocked a buyable as replacement",
			goalDescription: "1e175 money",
			rewardDescription: "Permanently unlock the buyable",
			unlocked() { return hasUpgrade("m", 34) || (inChallenge("w", 12) && !inChallenge("w", 21)) || hasChallenge("w", 12) },
			canComplete() { return player.m.points.gte("1e175")},
		},
        21: {
			name: "Combo",
			challengeDescription: "Applies challenge 11 and 12 at the same time",
			goalDescription: "1e1421 Kwh",
            countsAs: [11, 12],
			rewardDescription: "Add 1 to the money effect exponent",
			unlocked() { return hasUpgrade("m", 43) || inChallenge("w", 21) || hasChallenge("w", 21) },
			canComplete() { return player.points.gte("1e1421")},
		},
        22: {
			name: "Ouch",
			challengeDescription: "Exponentiate electricity gain by 0.001 but multiply electricity gain by the 2nd money buyable effect",
			goalDescription: "1e79 Kwh",
			rewardDescription: "Adds 0.015 to worker gain exponent",
			unlocked() { return player.w.best.gte("1e4600") || inChallenge("w", 22) || hasChallenge("w", 22) },
			canComplete() { return player.points.gte("1e79")},
		},
	},
	milestones: {
		0: {
			requirementDescription: "1e18 Workers",
			done() { return player.w.best.gte("1e18") },
			effectDescription: "Batteries reset nothing",
		},
        1: {
			requirementDescription: "1e200 Workers",
			done() { return player.w.best.gte("1e200") },
			effectDescription: "Gain 100% of worker gain on reset every second",
		},
	},
})
addLayer("c", {
    tabFormat: {
        "Main":{
            content: [
                "main-display",
                "prestige-button"
            ],
        },
        "Upgrades":{
            content: [
                "main-display",
                "upgrades"
            ],
        },
        "Milestones":{
            content: [
                "main-display",
                "milestones"
            ],
            unlocked() { return hasMilestone("c", 0) }
        },
        "Softcaps":{
            content: [
                "main-display",
                ["display-text", function() { 
                    let text = ""
                    if(player.c.best.gte(10)) text = text + "10 Coal Power Plants : Base Cost Exp 3 --> 3.25<br><br>"
                    if(player.c.best.gte(15)) text = text + "15 Coal Power Plants : Base Cost Exp 3.25 --> 3.5<br><br>"
                    if(player.c.best.gte(20)) text = text + "20 Coal Power Plants : Base Cost Exp 3.5 --> 3.75<br><br>"
                    if(player.c.best.gte(25)) text = text + "25 Coal Power Plants : Base Cost Exp 3.75 --> 4.25<br><br>"
                    if(player.c.best.gte(30)) text = text + "30 Coal Power Plants : Base Cost Exp 4.25 --> 4.75<br><br>"
                    if(player.c.best.gte(35)) text = text + "35 Coal Power Plants : Base Cost Exp 4.75 --> 5.5<br><br>"
                    if(player.c.best.gte(60)) text = text + "60 Coal Power Plants : Base Cost Exp 5.5 --> 6.25<br><br>"
                    if(player.c.best.gte(70)) text = text + "70 Coal Power Plants : Base Cost Exp 6.25 --> 7<br><br>"
                    if(player.c.best.gte(85)) text = text + "85 Coal Power Plants : Base Cost Exp 7 --> 8<br><br>"
                    if(player.c.best.gte(100)) text = text + "100 Coal Power Plants : Base Cost Exp 8 --> 10.5<br><br>"
                    return text
                },]
            ],
            unlocked() { return player.c.best.gte(10) }
        },
    },
    name: "coal power plants", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "C", // This appears on the layer's node. Default is the id with the first letter capitalized
    row: 2, // Row the layer is in on the tree (0 is the first row)
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    color: "#435041",
	branches: ["b", "w"],
    hotkeys: [
        {key: "c", description: "Press C to Coal Power Plant Reset", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return hasUpgrade("b", 35) || player.c.unlocked},
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
        best: new Decimal(0),
        total: new Decimal(0),
        first: 0,
        auto: false,
        pseudoUpgs: [],
    }},
    requires() { return new Decimal("1e154") }, // Can be a function that takes requirement increases into account
    resource: "coal power plants", // Name of prestige currency
    baseResource: "workers", // Name of resource prestige is based on
    baseAmount() {return player.w.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent() { // Prestige currency exponent
        exp = new Decimal(3)
        if(player.c.points.gte(10)) exp = exp.add(0.25)
        if(player.c.points.gte(15)) exp = exp.add(0.25)
        if(player.c.points.gte(20)) exp = exp.add(0.25)
        if(player.c.points.gte(25)) exp = exp.add(0.5)
        if(player.c.points.gte(30)) exp = exp.add(0.5)
        if(player.c.points.gte(35)) exp = exp.add(0.75)
        if(player.c.points.gte(60)) exp = exp.add(0.75)
        if(player.c.points.gte(70)) exp = exp.add(0.75)
        if(player.c.points.gte(85)) exp = exp.add(1)
        if(player.c.points.gte(100)) exp = exp.add(2.5)
        if(inChallenge("n", 11)) exp = exp.add(new Decimal(0.05).times(player.c.upgrades.length))
        if(hasUpgrade("p", 11)) exp = exp.minus(tmp.p.upgrades[11].effect)
        if(hasUpgrade("w", 54)) exp = exp.minus(0.0012)
        return exp
    },
	base() {return new Decimal(25)},
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if(hasUpgrade("m", 41)) {
            if(hasUpgrade("m", 42)) {mult = mult.div(tmp.m.effect.pow(0.5))}
            mult = mult.div(tmp.m.effect.pow(0.5))
        }
        mult = mult.div(tmp.m.buyables[12].effect)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        exp = new Decimal(1)
        return exp
    },
	effect() {
        if(inChallenge("s", 11) || inChallenge("s", 12)) {
            return new Decimal(1)
        }
		eff = new Decimal(10)
        if(hasUpgrade("c", 14)) {eff = eff.add(tmp.c.upgrades[14].effect)}
        if(hasUpgrade("m", 44)) {eff = eff.pow(tmp.m.upgrades[44].effect)}
        if(hasUpgrade("c", 22)) {eff = eff.pow(2)}
		eff = eff.pow(player.c.points)
		return eff
	},
	effectDescription() {
        if(hasUpgrade("c", 12)) {return "Which Are Boosting Electricity Gain By "+format(tmp.c.effect.pow(100))+"x And Boosting Worker Gain By "+format(tmp.c.effect)+"x"}
		return "Which Are Boosting Electricity Gain By "+format(tmp.c.effect.pow(100))+"x"
	},
	resetsNothing() { return hasMilestone("c", 3) },
    canBuyMax() { return hasMilestone("sh", 1) },
    autoPrestige() { return hasMilestone("sh", 1) },
    doReset(resettingLayer){
        let keep = []
        if(hasMilestone("sh", 1)) keep.push("milestones")
        if(hasMilestone("sh", 5)) keep.push("upgrades")
        if (layers[resettingLayer].row > this.row) layerDataReset(this.layer, keep)
    },
    upgrades: {
        11:{
            title: "That Coal Ain't Burning Itself",
            description: "Hire more workers to take care of your coal power plants",
            cost() { return new Decimal(2) },
            unlocked() { return player.c.best.gte(1) || hasUpgrade("c", 11) },
            effect() {
                return new Decimal(player.c.points.pow(10).add(10))
            },
            effectDisplay() { return "*" + format(tmp.c.upgrades[11].effect) + " to worker gain"}
		},
        12:{
            title: "More Power Plants = More Jobs",
            description: "Coal power plant's effect also boosts worker gain",
            cost() { return new Decimal(2) },
            unlocked() { return hasUpgrade("c", 11) || hasUpgrade("c", 12) },
		},
        13:{
            title: "Batteries Needed",
            description: "Reduce battery cost exponent by 1",
            cost() { return new Decimal(3) },
            unlocked() { return hasUpgrade("c", 12) || hasUpgrade("c", 13) },
		},
        14:{
            title: "Self Synergy",
            description: "Coal power plants adds to their effect's base",
            cost() { return new Decimal(5) },
            unlocked() { return hasUpgrade("c", 13) || hasUpgrade("c", 14) },
            effect() {
                eff = new Decimal(player.c.points)
                if(hasUpgrade("w", 31)) {eff = eff.times(tmp.w.upgrades[31].effect)}
                return eff
            },
            effectDisplay() { return "+" + format(tmp.c.upgrades[14].effect) + " to coal power plant effect base"}
		},
        15:{
            title: "2nd Buyable",
            description: "Unlock a second money buyable",
            cost() { return new Decimal(8) },
            unlocked() { return hasUpgrade("m", 44) || hasUpgrade("c", 15) },
		},
        21:{
            title: "And Yet Another",
            description: "Unlock a third nuclear challenge",
            cost() { return new Decimal(17) },
            unlocked() { return player.m.points.gte("1e630000") || hasUpgrade("c", 21) },
		},
        22:{
            title: "Cheap Fuel",
            description: "Coal is cheaper, thus your coal power plant effect is squared",
            cost() { return new Decimal(25) },
            unlocked() { return hasUpgrade("p", 14) || hasUpgrade("c", 22) },
		},
        23:{
            title: "Let's Get Even More Corrupt",
            description: "Corrupt politicians effect hardcap now becomes a softcap and quintuple corrupt politician gain",
            cost() { return new Decimal(35) },
            unlocked() { return getBuyableAmount("s", 11).gte(5) || hasUpgrade("c", 23) },
		},
        24:{
            title: "Corrupt Synergy",
            description: "Corrupt governments boost their own gain",
            cost() { return new Decimal(52) },
            unlocked() { return getBuyableAmount("s", 11).gte(7) || hasUpgrade("c", 24) },
            effect() {
                return new Decimal(player.g.points.add(1).log10().add(1).pow(4/3).min(25))
            },
            effectDisplay() {return "*"+format(tmp.c.upgrades[24].effect)+" to corrupt government gain"},
		},
        25:{
            title: "Solar Boost",
            description: "Solar power plant cost is brought to the 1.25th root",
            cost() { 
                if(player.cap.first && !player.com.first) return new Decimal(85)
                return new Decimal(78) 
            },
            unlocked() { return hasUpgrade("w", 54) || hasUpgrade("c", 25) },
		},
    },
	milestones: {
        0: {
			requirementDescription: "2 Coal Power Plants",
			done() { return player.c.best.gte(2) },
			effectDescription: "Unlock auto battery prestige and battery buy max",
		},
		1: {
			requirementDescription: "3 Coal Power Plants",
			done() { return player.c.best.gte(3) },
			effectDescription: "Keep money upgrades on reset",
		},
        2: {
			requirementDescription: "5 Coal Power Plants",
			done() { return player.c.best.gte(5) },
			effectDescription: "Keep battery/worker milestones and worker challenges on reset",
		},
        3: {
			requirementDescription: "10 Coal Power Plants",
			done() { return player.c.best.gte(10) },
			effectDescription: "Coal power plant resets nothing",
		},
	},
})
addLayer("n", {
    tabFormat: {
        "Main":{
            content: [
                "main-display",
                "prestige-button"
            ],
        },
        "Upgrades":{
            content: [
                "main-display",
                "upgrades"
            ],
        },
        "Milestones":{
            content: [
                "main-display",
                "milestones"
            ],
            unlocked() { return hasMilestone("n", 0) }
        },
        "Buyables":{
            content: [
                "main-display",
                "buyables"
            ],
            unlocked() { return tmp.n.buyables[11].unlocked }
        },
        "Challenges":{
            content: [
                "main-display",
                "challenges"
            ],
            unlocked() { return tmp.n.challenges[11].unlocked }
        },
        "Softcaps":{
            content: [
                "main-display",
                ["display-text", function() { 
                    let text = ""
                    if(player.n.best.gte(5)) text = text + "5 Nuclear Power Plants : Base Cost Exp 5 --> 5.5<br><br>"
                    if(player.n.best.gte(10)) text = text + "10 Nuclear Power Plants : Base Cost Exp 5.5 --> 6<br><br>"
                    if(player.n.best.gte(11)) text = text + "11 Nuclear Power Plants : Base Cost Exp 6 --> 8.5<br><br>"
                    if(player.n.best.gte(15)) text = text + "15 Nuclear Power Plants : Base Cost Exp 8.5 --> 9.25<br><br>"
                    if(player.n.best.gte(20)) text = text + "20 Nuclear Power Plants : Base Cost Exp 9.25 --> 10<br><br>"
                    if(player.n.best.gte(25)) text = text + "25 Nuclear Power Plants : Base Cost Exp 10 --> 10.75<br><br>"
                    if(player.n.best.gte(30)) text = text + "30 Nuclear Power Plants : Base Cost Exp 10.75 --> 11.5<br><br>"
                    if(player.n.best.gte(40)) text = text + "40 Nuclear Power Plants : Base Cost Exp 11.5 --> 12.5<br><br>"
                    if(player.n.best.gte(50)) text = text + "50 Nuclear Power Plants : Base Cost Exp 12.5 --> 14<br><br>"
                    return text
                },]
            ],
            unlocked() { return player.n.best.gte(5) }
        },
    },
    name: "nuclear power plants", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "N", // This appears on the layer's node. Default is the id with the first letter capitalized
    row: 2, // Row the layer is in on the tree (0 is the first row)
    position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    color: "#0aeb4f",
	branches: ["b", "w"],
    hotkeys: [
        {key: "n", description: "Press N to Nuclear Power Plant Reset", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return hasUpgrade("b", 45) || player.n.unlocked},
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
        best: new Decimal(0),
        total: new Decimal(0),
        first: 0,
        auto: false,
        pseudoUpgs: [],
    }},
    requires() { return new Decimal("1e11638") }, // Can be a function that takes requirement increases into account
    resource: "nuclear power plants", // Name of prestige currency
    baseResource: "workers", // Name of resource prestige is based on
    baseAmount() {return player.w.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent() { // Prestige currency exponent
        exp = new Decimal(5)
        if(player.n.points.gte(5)) exp = exp.add(0.5)
        if(player.n.points.gte(10)) exp = exp.add(0.5)
        if(player.n.points.gte(11)) exp = exp.add(2.5)
        if(player.n.points.gte(15)) exp = exp.add(0.75)
        if(player.n.points.gte(20)) exp = exp.add(0.75)
        if(player.n.points.gte(25)) exp = exp.add(0.75)
        if(player.n.points.gte(30)) exp = exp.add(0.75)
        if(player.n.points.gte(40)) exp = exp.add(1)
        if(player.n.points.gte(50)) exp = exp.add(1.5)
        if(hasUpgrade("p", 12)) exp = exp.minus(tmp.p.upgrades[12].effect)
        if(hasUpgrade("p", 15)) exp = exp.minus(1)
        if(hasUpgrade("n", 15)) exp = exp.minus(1)
        return exp
    },
	base() {
        base = new Decimal(125)
        base = base.minus(1).div(tmp.n.buyables[22].effect.max(1)).add(1)
        if(hasUpgrade("com", 15)) base = base.pow(0.05)
        return base
    },
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if(hasUpgrade("m", 54)) {mult = mult.div(tmp.m.upgrades[54].effect)}
        if(hasUpgrade("p", 23)) {mult = mult.div(tmp.p.upgrades[23].effect)}
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        exp = new Decimal(1)
        return exp
    },
	effect() {
        if(inChallenge("s", 11) || inChallenge("s", 12)) {
            return new Decimal(1)
        }
		eff = new Decimal(1000)
        if(hasUpgrade("m", 52)) {eff = eff.pow(tmp.m.upgrades[52].effect)}
		eff = eff.pow(player.n.points)
		return eff
	},
	effectDescription() {
        if(hasChallenge("n", 11)) {
            return "Which Are Boosting Electricity Gain By "+format(tmp.n.effect.pow(1000))+"x And Divide Battery Cost By "+format(tmp.n.effect.pow(10000))+"x"
        }
        return "Which Are Boosting Electricity Gain By "+format(tmp.n.effect.pow(1000))+"x"
	},
	resetsNothing() { return hasMilestone("n", 1) },
    canBuyMax() { return hasMilestone("sh", 1) },
    autoPrestige() { return hasMilestone("sh", 1) },
    doReset(resettingLayer){
        let keep = []
        if(hasMilestone("sh", 0)) keep.push("challenges")
        if(hasMilestone("sh", 1)) keep.push("milestones")
        if(hasMilestone("sh", 2)) keep.push("buyables")
        if(hasMilestone("sh", 5)) keep.push("upgrades")
        if (layers[resettingLayer].row > this.row) layerDataReset(this.layer, keep)
    },
    upgrades: {
        11:{
            title: "Nuclear Engineers",
            description: "Hire engineers to take care of your nuclear power plants",
            cost() { return new Decimal(2) },
            unlocked() { return player.n.best.gte(1) || hasUpgrade("n", 11) },
            effect() {
                return new Decimal(player.n.points.add(2).pow(player.n.points).add(9))
            },
            effectDisplay() { return "*" + format(tmp.n.upgrades[11].effect) + " to worker gain"}
		},
        12:{
            title: "Already",
            description: "Unlock a nuclear challenge",
            cost() { return new Decimal(2) },
            unlocked() { return hasUpgrade("n", 11) || hasUpgrade("n", 12) },
		},
        13:{
            title: "Exponent Reducer",
            description: "Nuclear power plants reduces battery exponent",
            cost() { return new Decimal(3) },
            unlocked() { return hasUpgrade("n", 12) || hasUpgrade("n", 13) },
            effect() {
                return new Decimal(player.n.points.add(1).pow(1/3).minus(1).min(2))
            },
            effectDisplay() { return "-" + format(tmp.n.upgrades[13].effect) + " to battery exponent"}
		},
        14:{
            title: "Treatment Facilities",
            description: "Create waste treatment facilities, making nuclear power plants boost worker gain",
            cost() { return new Decimal(10) },
            unlocked() { return hasUpgrade("p", 15) || hasUpgrade("n", 14) },
            effect() {
                return new Decimal(player.n.points.add(1).pow(15000))
            },
            effectDisplay() { return "*" + format(tmp.n.upgrades[14].effect) + " to worker gain"}
		},
        15:{
            title: "Softcaps Are Dumb",
            description: "Reduce nuclear power plant cost exponent by 1",
            cost() { return new Decimal(11) },
            unlocked() { return hasChallenge("n", 22) || hasUpgrade("n", 15) },
		},
        21:{
            title: "You Can't Buy Me :)-",
            description: "Unlock another nuclear buyable and add 0.02 to the base effect of the first",
            cost() { return new Decimal(15) },
            unlocked() { return hasUpgrade("m", 61) || hasUpgrade("n", 21) },
		},
        22:{
            title: "Low Costs",
            description: "Divide the cost of solar power plants by 5",
            cost() { return new Decimal(18) },
            unlocked() { return hasChallenge("s", 11) || hasUpgrade("n", 22) },
		},
        23:{
            title: "Nuclear 5th Of The Name",
            description: "Unlock another nuclear buyable",
            cost() { return new Decimal(45) },
            unlocked() { return hasUpgrade("com", 14) || hasUpgrade("n", 23) },
		},
        24:{
            title: "Nuclear Combo",
            description: "Multiply share gain based on nuclear buyables",
            cost() { return new Decimal(49) },
            unlocked() { return hasUpgrade("n", 23) || hasUpgrade("n", 24) },
            effect() {
                return new Decimal(getBuyableAmount("n", 11).add(1).times(getBuyableAmount("n", 12).add(1)).times(getBuyableAmount("n", 13).add(1)).times(getBuyableAmount("n", 21).add(1)).times(getBuyableAmount("n", 22).add(1)).pow(3).times(10))
            },
            effectDisplay() { return "*" + format(tmp.n.upgrades[24].effect) + " to share gain"}
		},
    },
    buyables: {
        11: {
            title: "Nuclear Weapon",
            display() {
                return "Boosts corrupt politician gain by " + format(tmp.n.buyables[11].effect) + "x<br>Cost : " + format(new Decimal(5).add(getBuyableAmount("n", 11).pow(1.25)).minus(getBuyableAmount("n", 11)).minus(tmp.n.buyables[22].effect).floor()) + " nuclear power plants"
            },
            unlocked() { return hasUpgrade("m", 61) },
            canAfford() { 
                return player.n.points.gte(new Decimal(5).add(getBuyableAmount("n", 11).pow(1.25)).minus(getBuyableAmount("n", 11)).minus(tmp.n.buyables[22].effect).floor()) 
            },
            buy() { 
                player.n.points = player.n.points.minus(new Decimal(5).add(getBuyableAmount("n", 11).pow(1.25)).minus(getBuyableAmount("n", 11)).minus(tmp.n.buyables[22].effect).floor()).min(player.n.points)
                setBuyableAmount("n", 11, getBuyableAmount("n", 11).add(1))
            },
            effect() { 
                eff = new Decimal(1.1)
                if(hasUpgrade("n", 21)) {
                    eff = eff.add(0.02)
                    eff = eff.add(tmp.n.buyables[12].effect)
                }
                eff = eff.pow(getBuyableAmount("n", 11))
                if(hasUpgrade("com", 14)) eff = eff.pow(5)
                return eff 
            }
        },
        12: {
            title: "Plutonium-239",
            display() {
                return "Add " + format(tmp.n.buyables[12].effect) + " to Nuclear Weapon's base<br>Cost : " + format(new Decimal(10).add(getBuyableAmount("n", 12).pow(1.5)).minus(getBuyableAmount("n", 12)).minus(tmp.n.buyables[22].effect).floor()) + " nuclear power plants"
            },
            unlocked() { return hasUpgrade("n", 21) },
            canAfford() { 
                return player.n.points.gte(new Decimal(10).add(getBuyableAmount("n", 12).pow(1.5)).minus(getBuyableAmount("n", 12)).minus(tmp.n.buyables[22].effect).floor()) 
            },
            buy() { 
                player.n.points = player.n.points.minus(new Decimal(10).add(getBuyableAmount("n", 12).pow(1.5)).minus(getBuyableAmount("n", 12)).minus(tmp.n.buyables[22].effect).floor()).min(player.n.points)
                setBuyableAmount("n", 12, getBuyableAmount("n", 12).add(1))
            },
            effect() { 
                eff = getBuyableAmount("n", 12)
                if(hasUpgrade("com", 14)) eff = eff.times(5)
                eff = eff.pow(0.75).times(0.01).times(tmp.n.buyables[13].effect)
                return  eff
            }
        },
        13: {
            title: "Curium-243",
            display() {
                return "Multiply Plutonium-239's effect by " + format(tmp.n.buyables[13].effect) + " <br>Cost : " + format(new Decimal(10).add(getBuyableAmount("n", 13).pow(1.75)).minus(getBuyableAmount("n", 13)).minus(tmp.n.buyables[22].effect).floor()) + " nuclear power plants"
            },
            unlocked() { return hasUpgrade("s", 14) },
            canAfford() { 
                return player.n.points.gte(new Decimal(10).add(getBuyableAmount("n", 13).pow(1.75)).minus(getBuyableAmount("n", 13)).minus(tmp.n.buyables[22].effect).floor()) 
            },
            buy() { 
                player.n.points = player.n.points.minus(new Decimal(10).add(getBuyableAmount("n", 13).pow(1.75)).minus(getBuyableAmount("n", 13)).minus(tmp.n.buyables[22].effect).floor()).min(player.n.points)
                setBuyableAmount("n", 13, getBuyableAmount("n", 13).add(1))
            },
            effect() { 
                eff = getBuyableAmount("n", 13)
                if(hasUpgrade("com", 14)) eff = eff.times(5)
                eff = eff.times(0.1).add(1).pow(tmp.n.buyables[21].effect)
                return eff
            }
        },
        21: {
            title: "Berkelium-243",
            display() {
                return "Raise Curium-243's effect to the " + format(tmp.n.buyables[21].effect) + " th power<br>Cost : " + format(new Decimal(10).add(getBuyableAmount("n", 21).pow(2.5)).minus(getBuyableAmount("n", 21)).minus(tmp.n.buyables[22].effect).floor()) + " nuclear power plants"
            },
            unlocked() { return hasUpgrade("s", 14) },
            canAfford() { 
                return player.n.points.gte(new Decimal(10).add(getBuyableAmount("n", 21).pow(2.5)).minus(getBuyableAmount("n", 21)).minus(tmp.n.buyables[22].effect).floor()) 
            },
            buy() { 
                player.n.points = player.n.points.minus(new Decimal(10).add(getBuyableAmount("n", 21).pow(2.5)).minus(getBuyableAmount("n", 21)).minus(tmp.n.buyables[22].effect).floor()).min(player.n.points)
                setBuyableAmount("n", 21, getBuyableAmount("n", 21).add(1))
            },
            effect() { 
                eff = getBuyableAmount("n", 21) 
                if(hasUpgrade("com", 14)) eff = eff.times(5)
                eff = eff.times(0.25).add(1) 
                return eff
            }
        },
        22: {
            title: "Californium-243",
            display() {
                return "Reduce all previous buyables' costs " + (tmp.n.buyables[22].effect.gte(1) ? "and divide nuclear power plant base ":"") +"by " + format(tmp.n.buyables[22].effect) + "<br>Cost : " + format(new Decimal(25).add(getBuyableAmount("n", 22).pow(1.25)).minus(hasUpgrade("com", 21) ? new Decimal(25):new Decimal(0)).floor()) + " nuclear power plants"
            },
            unlocked() { return hasUpgrade("n", 23) },
            canAfford() { 
                return player.n.points.gte(new Decimal(25).add(getBuyableAmount("n", 22).pow(1.25)).minus(hasUpgrade("com", 21) ? new Decimal(25):new Decimal(0)).floor()) 
            },
            buy() { 
                player.n.points = player.n.points.minus(new Decimal(25).add(getBuyableAmount("n", 22).pow(1.25)).minus(hasUpgrade("com", 21) ? new Decimal(25):new Decimal(0)).floor()).min(player.n.points)
                setBuyableAmount("n", 22, getBuyableAmount("n", 22).add(1))
            },
            effect() { 
                eff = getBuyableAmount("n", 22)
                eff = eff.pow(1.25).div(2)
                return eff
            }
        },
    },
    challenges: {
		11: {
			name: "Expensive Upgrades",
			challengeDescription: "Buying an upgrade divides global electricity production, and reduces their layer's production as well",
			goalDescription: "1e5760 workers",
			rewardDescription: "Nuclear power plant effect also applies to battery cost and unlock a third money buyable as well as another challenge",
			unlocked() { return hasUpgrade("n", 12) || inChallenge("n", 11) || hasChallenge("n", 11) },
			canComplete() { return player.w.points.gte("1e5760")},
		},
        12: {
			name: "Worthless Buyables",
			challengeDescription: "Buyables have no effect",
			goalDescription: "1e11850 workers",
			rewardDescription: "Unlock a row of money upgrades",
			unlocked() { return hasChallenge("n", 11) || inChallenge("n", 12) || hasChallenge("n", 12) },
			canComplete() { return player.w.points.gte("1e11850")},
		},
        21: {
			name: "Gotta Go Fast",
			challengeDescription: "Electricity gain drops over time until the challenge is completed",
			goalDescription: "1e8300 workers",
			rewardDescription: "Unlock a multiplier to electricity gain that grows over time",
			unlocked() { return hasUpgrade("c", 21) || inChallenge("n", 21) || hasChallenge("n", 21) },
			canComplete() { return player.w.points.gte("1e8300")},
			rewardEffect() { return new Decimal(player.n.resetTime).pow(25000).min("e50000") },
			rewardDisplay() { return "Boost Electricty Gain By "+format(tmp.n.challenges[21].rewardEffect)+"x"}
		},
        22: {
			name: "Anti-Corruption Politics",
			challengeDescription: "Corruption effect is reduced by 1",
			goalDescription: "1e1130000 KWh",
			rewardDescription: "Multiply corrupt politician gain based on nuclear power plants",
			unlocked() { return hasUpgrade("p", 21) || inChallenge("n", 22) || hasChallenge("n", 22) },
			canComplete() { return player.points.gte("1e1130000")},
			rewardEffect() { return new Decimal(player.n.points).add(1).pow(2/3) },
			rewardDisplay() { return "Boost Corrupt Politician Gain By "+format(tmp.n.challenges[22].rewardEffect)+"x"}
		},
	},
	milestones: {
		0: {
			requirementDescription: "5 Nuclear Power Plants",
			done() { return player.n.best.gte(5) },
			effectDescription: "Keep battery upgrades on reset",
		},
        1: {
			requirementDescription: "10 Nuclear Power Plants",
			done() { return player.n.best.gte(10) },
			effectDescription: "Nuclear power plants resets nothing",
		},
	},
})
addLayer("s", {
    tabFormat: {
        "Main":{
            content: [
                "main-display",
                "prestige-button"
            ],
        },
        "Upgrades":{
            content: [
                "main-display",
                "upgrades"
            ],
        },
        "Milestones":{
            content: [
                "main-display",
                "milestones"
            ],
            unlocked() { return hasMilestone("s", 0) }
        },
        "Buyables":{
            content: [
                "main-display",
                "buyables"
            ],
            unlocked() { return tmp.s.buyables[11].unlocked }
        },
        "Challenges":{
            content: [
                "main-display",
                "challenges"
            ],
            unlocked() { return tmp.s.challenges[11].unlocked }
        },
    },
    name: "solar power plants", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "S", // This appears on the layer's node. Default is the id with the first letter capitalized
    row: 2, // Row the layer is in on the tree (0 is the first row)
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    color: "#fae50e",
	branches: ["b", "w"],
    hotkeys: [
        {key: "s", description: "Press S to Solar Power Plant Reset", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return hasUpgrade("p", 24) || player.s.unlocked},
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
        best: new Decimal(0),
        total: new Decimal(0),
        first: 0,
        auto: false,
        pseudoUpgs: [],
        challenge2: [0, 0, 0, 0, 0, 0, 0, 0, 0]
    }},
    requires() { return new Decimal(100) }, // Can be a function that takes requirement increases into account
    resource: "solar power plants", // Name of prestige currency
    baseResource: "batteries", // Name of resource prestige is based on
    baseAmount() {return player.b.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent() { // Prestige currency exponent
        exp = new Decimal(1.05)
        if(hasChallenge("s", 11)) exp = exp.minus(0.01)
        if(hasUpgrade("m", 64)) exp = exp.minus(0.005)
        return exp
    },
	base() {
        base = new Decimal(1.1)
        if(hasUpgrade("cb", 25)) base = base.pow(0.6)
        return base
    },
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if(hasUpgrade("s", 11)) {mult = mult.div(1.5)}
        if(hasUpgrade("g", 11)) {mult = mult.div(tmp.g.upgrades[11].effect)}
        if(hasUpgrade("n", 22)) {mult = mult.div(5)}
        if(hasUpgrade("b", 53)) {mult = mult.div(tmp.b.upgrades[53].effect)}
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        exp = new Decimal(1)
        if(hasUpgrade("c", 25)) exp = exp.times(1.25)
        return exp
    },
	effect() {
        if(inChallenge("s", 11) || inChallenge("s", 12)) {
            return new Decimal(1)
        }
		eff = new Decimal(10)
		eff = eff.pow(player.s.points.pow(5))
        if(hasUpgrade("s", 13)) {eff = eff.pow(2)}
		return eff
	},
	effectDescription() {
        return "Which Are Boosting Electricity Gain By "+format(tmp.s.effect)+"x And Divide Battery Cost By "+format(tmp.s.effect.pow(1000))+"x"
	},
	resetsNothing() { return hasMilestone("s", 0) },
    canBuyMax() { return hasMilestone("sh", 1) },
    autoPrestige() { return hasMilestone("sh", 1) },
    doReset(resettingLayer){
        let keep = []
        if(hasMilestone("sh", 0)) keep.push("challenges")
        if(hasMilestone("sh", 1)) keep.push("milestones")
        if(hasMilestone("sh", 2)) keep.push("buyables")
        if(hasMilestone("sh", 5)) keep.push("upgrades")
        if (layers[resettingLayer].row > this.row) layerDataReset(this.layer, keep)
    },
    upgrades: {
        11:{
            title: "Better Batteries",
            description: "Solar power plants require less batteries",
            cost() { return new Decimal(15) },
            unlocked() { return getBuyableAmount("s", 11).gte(1) || hasUpgrade("s", 11) },
		},
        12:{
            title: "Solar Engineers",
            description: "Hire engineers to take care of your solar power plants",
            cost() { return new Decimal(19) },
            unlocked() { return getBuyableAmount("s", 11).gte(2) || hasUpgrade("s", 12) },
            effect() {
                eff = new Decimal(player.s.points.pow(player.s.points.pow(2)).add(9))
                if(inChallenge("s", 12)) {
                    eff = new Decimal(1)
                }
                return eff
            },
            effectDisplay() { return "*" + format(tmp.s.upgrades[12].effect) + " to worker gain"}
		},
        13:{
            title: "Effect Booster",
            description: "Square the solar power plant effect",
            cost() { return new Decimal(23) },
            unlocked() { return getBuyableAmount("s", 11).gte(4) || hasUpgrade("s", 13) },
		},
        14:{
            title: "Heavier Atoms",
            description: "Unlock 2 new nuclear power plant buyables",
            cost() { return new Decimal(30) },
            unlocked() { return getBuyableAmount("s", 11).gte(6) || hasUpgrade("s", 14) },
		},
        15:{
            title: "No Can Do",
            description() {
                if(hasUpgrade("s", 15)) return "Unlock Inflation"
                return "???"
            },
            cost() { return new Decimal(55) },
            unlocked() { return getBuyableAmount("s", 11).gte(8) || hasUpgrade("s", 15) },
            onPurchase() {player.i.unlocked = true}
		},
    },
    buyables: {
        11: {
            title: "Too Much Light",
            display() {
                return "Unlock an upgrade<br>Cost : " + format(new Decimal(15).add(getBuyableAmount("s", 11).pow(2)).minus(getBuyableAmount("s", 11).pow(1.5)).floor()) + " solar power plants"
            },
            unlocked() { return player.s.unlocked },
            canAfford() { 
                return player.s.points.gte(new Decimal(15).add(getBuyableAmount("s", 11).pow(2)).minus(getBuyableAmount("s", 11).pow(1.5)).floor()) && getBuyableAmount("s", 11).lt(10) 
            },
            buy() { 
                player.s.points = player.s.points.minus(new Decimal(15).add(getBuyableAmount("s", 11).pow(2)).minus(getBuyableAmount("s", 11).pow(1.5)).floor())
                setBuyableAmount("s", 11, getBuyableAmount("s", 11).add(1))
            },
        },
    },
    challenges: {
		11: {
			name: "No Effects",
			challengeDescription: "All layers effects are 1, but electricity gain is raised to the 15th power",
			goalDescription: "e950000 KWh",
			rewardDescription: "Reduce solar power plant cost exponent by 0.01",
			unlocked() { return hasUpgrade("p", 31) || inChallenge("s", 11) || hasChallenge("s", 11) },
			canComplete() { return player.points.gte("e950000")},
		},
        12: {
			name: "Satan's Masterpiece",
			challengeDescription() {return "The row 3 effects and side layers effects don't work anymore, and choose between 3 buffs and nerfs in the corrupt politician layer<br>Challenge completions : "+challengeCompletions("s", 12)+"/9"},
			goalDescription() {
                if(getBuyableAmount("p", 11).add(getBuyableAmount("p", 21)).eq(2) && player.s.challenge2[0] == 0) return "e253,762 KWh/s"
                if(getBuyableAmount("p", 11).add(getBuyableAmount("p", 22)).eq(2) && player.s.challenge2[1] == 0) return "e255,294 KWh/s"
                if(getBuyableAmount("p", 11).add(getBuyableAmount("p", 23)).eq(2) && player.s.challenge2[2] == 0) return "e253,546 KWh/s"
                if(getBuyableAmount("p", 12).add(getBuyableAmount("p", 21)).eq(2) && player.s.challenge2[3] == 0) return "e87,252 KWh/s"
                if(getBuyableAmount("p", 12).add(getBuyableAmount("p", 22)).eq(2) && player.s.challenge2[4] == 0) return "e203,181 KWh/s"
                if(getBuyableAmount("p", 12).add(getBuyableAmount("p", 23)).eq(2) && player.s.challenge2[5] == 0) return "e202,062 KWh/s"
                if(getBuyableAmount("p", 13).add(getBuyableAmount("p", 21)).eq(2) && player.s.challenge2[6] == 0) return "e87,258 KWh/s"
                if(getBuyableAmount("p", 13).add(getBuyableAmount("p", 22)).eq(2) && player.s.challenge2[7] == 0) return "e203,503 KWh/s"
                if(getBuyableAmount("p", 13).add(getBuyableAmount("p", 23)).eq(2) && player.s.challenge2[8] == 0) return "e202,061 KWh/s"
                if(getBuyableAmount("p", 11).add(getBuyableAmount("p", 12)).add(getBuyableAmount("p", 13)).add(getBuyableAmount("p", 21)).add(getBuyableAmount("p", 22)).add(getBuyableAmount("p", 23)).eq(2)) return "You already completed the challenge with this combination, restart the challenge and choose another one"
                return "Depends on the buff/nerf"
            },
			rewardDescription() {
                if(challengeCompletions("s", 12) == 9) return "Raise electricity gain to the 1.05 th power"
                return "You need "+(9-challengeCompletions("s", 12))+" more completions to unlock the reward"
            },
			unlocked() { return hasUpgrade("c", 24) || inChallenge("s", 12) || hasChallenge("s", 12) },
            completionLimit: 9,
			canComplete() { 
                if(getBuyableAmount("p", 11).add(getBuyableAmount("p", 21)).eq(2)) return getPointGen().gte("e253762") && player.s.challenge2[0] == 0
                if(getBuyableAmount("p", 11).add(getBuyableAmount("p", 22)).eq(2)) return getPointGen().gte("e255294") && player.s.challenge2[1] == 0
                if(getBuyableAmount("p", 11).add(getBuyableAmount("p", 23)).eq(2)) return getPointGen().gte("e253546") && player.s.challenge2[2] == 0
                if(getBuyableAmount("p", 12).add(getBuyableAmount("p", 21)).eq(2)) return getPointGen().gte("e87252") && player.s.challenge2[3] == 0
                if(getBuyableAmount("p", 12).add(getBuyableAmount("p", 22)).eq(2)) return getPointGen().gte("e203181") && player.s.challenge2[4] == 0
                if(getBuyableAmount("p", 12).add(getBuyableAmount("p", 23)).eq(2)) return getPointGen().gte("e202062") && player.s.challenge2[5] == 0
                if(getBuyableAmount("p", 13).add(getBuyableAmount("p", 21)).eq(2)) return getPointGen().gte("e87258") && player.s.challenge2[6] == 0
                if(getBuyableAmount("p", 13).add(getBuyableAmount("p", 22)).eq(2)) return getPointGen().gte("e203503") && player.s.challenge2[7] == 0
                if(getBuyableAmount("p", 13).add(getBuyableAmount("p", 23)).eq(2)) return getPointGen().gte("e202061") && player.s.challenge2[8] == 0
                return getPointGen().layer > 1.79e308
            },
            onComplete() {
                if(getBuyableAmount("p", 11).add(getBuyableAmount("p", 21)).eq(2)) player.s.challenge2[0] = 1
                if(getBuyableAmount("p", 11).add(getBuyableAmount("p", 22)).eq(2)) player.s.challenge2[1] = 1
                if(getBuyableAmount("p", 11).add(getBuyableAmount("p", 23)).eq(2)) player.s.challenge2[2] = 1
                if(getBuyableAmount("p", 12).add(getBuyableAmount("p", 21)).eq(2)) player.s.challenge2[3] = 1
                if(getBuyableAmount("p", 12).add(getBuyableAmount("p", 22)).eq(2)) player.s.challenge2[4] = 1 
                if(getBuyableAmount("p", 12).add(getBuyableAmount("p", 23)).eq(2)) player.s.challenge2[5] = 1 
                if(getBuyableAmount("p", 13).add(getBuyableAmount("p", 21)).eq(2)) player.s.challenge2[6] = 1
                if(getBuyableAmount("p", 13).add(getBuyableAmount("p", 22)).eq(2)) player.s.challenge2[7] = 1 
                if(getBuyableAmount("p", 13).add(getBuyableAmount("p", 23)).eq(2)) player.s.challenge2[8] = 1
            },
		},
	},
	milestones: {
		0: {
			requirementDescription: "15 Solar Power Plants",
			done() { return player.s.best.gte(15) },
			effectDescription: "Solar power plants resets nothing",
		},
	},
})
addLayer("sh", {
    tabFormat: {
        "Main":{
            content: [
                "main-display",
                "prestige-button"
            ],
        },
        "Upgrades":{
            content: [
                "main-display",
                "upgrades"
            ],
        },
        "Milestones":{
            content: [
                "main-display",
                "milestones"
            ],
            unlocked() { return hasMilestone("sh", 0) }
        },
        "Challenges":{
            content: [
                "main-display",
                "challenges"
            ],
            unlocked() { return tmp.sh.challenges[11].unlocked }
        },
    },
    name: "shares", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "SH", // This appears on the layer's node. Default is the id with the first letter capitalized
    row: 3, // Row the layer is in on the tree (0 is the first row)
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    color: "#874406",
	branches: ["c", "n", "s"],
    hotkeys: [
        {key: "h", description: "Press H to Share Reset", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return hasUpgrade("m", 65) || player.sh.unlocked},
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
        best: new Decimal(0),
        total: new Decimal(0),
        first: 0,
        auto: false,
        pseudoUpgs: [],
    }},
    requires() { return new Decimal(140) }, // Can be a function that takes requirement increases into account
    resource: "shares", // Name of prestige currency
    baseResource: "power plants", // Name of resource prestige is based on
    baseAmount() {return player.c.points.add(player.n.points).add(player.s.points)}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent() { // Prestige currency exponent
        exp = new Decimal(25)
        if(hasUpgrade("cb", 24)) exp = exp.times(100)
        return exp
    },
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if(hasUpgrade("m", 82)) mult = mult.times(tmp.m.upgrades[82].effect)
        if(hasUpgrade("m", 85)) mult = mult.times(10)
        if(hasUpgrade("w", 55)) mult = mult.times("1e6")
        if(hasUpgrade("n", 24)) mult = mult.times(tmp.n.upgrades[24].effect)
        if(hasUpgrade("p", 43)) mult = mult.times(tmp.p.upgrades[43].effect)
        if(hasUpgrade("g", 31)) mult = mult.times(tmp.g.upgrades[31].effect)
        if(hasUpgrade("sh", 13)) mult = mult.times(tmp.sh.upgrades[13].effect)
        if(hasUpgrade("sh", 14)) mult = mult.times(tmp.sh.upgrades[14].effect)
        if(hasUpgrade("sh", 31)) mult = mult.times(10)
        if(hasUpgrade("com", 11)) mult = mult.times(tmp.com.upgrades[11].effect)
        if(hasUpgrade("com", 12)) mult = mult.times(tmp.com.upgrades[12].effect)
        if(hasUpgrade("cap", 11)) mult = mult.times(tmp.cap.upgrades[11].effect)
        if(hasUpgrade("cb", 23)) mult = mult.times(tmp.cb.upgrades[23].effect)
        if(hasChallenge("sh", 22)) mult = mult.times(tmp.sh.challenges[22].rewardEffect)
        if(hasChallenge("sh", 31)) mult = mult.times(tmp.sh.challenges[31].rewardEffect)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        exp = new Decimal(1)
        return exp
    },
	effect() {
		eff = new Decimal(1)
        if(hasUpgrade("sh", 12)) eff = eff.times(player.sh.points.add(1).pow(150))
		return eff
	},
	effectDescription() {
        if(!hasUpgrade("sh", 12)) return ""
        return "Which Are Boosting Worker Gain By " + format(tmp.sh.effect) + "x ( By Paying Them Below Minmum Wage Thanks To Your Corrupt Politicians )"
	},
    passiveGeneration() { return hasMilestone("sh", 4) },
    doReset(resettingLayer){
        let keep = []
        if(hasMilestone("cap", 0) || hasMilestone("com", 0)) keep.push("milestones")
        if(hasMilestone("cap", 1) || hasMilestone("com", 1)) keep.push("challenges")
        if(hasMilestone("cap", 2) || hasMilestone("com", 2)) keep.push("upgrades")
        if (layers[resettingLayer].row > this.row) layerDataReset(this.layer, keep)
    },
    upgrades: {
        11:{
            title: "Share Holder",
            description: "Congratulations, you bought your first share, to reward you, shares boost corrupt politician gain and inflation generation speed",
            cost() { return new Decimal(1) },
            unlocked() { return player.sh.unlocked || hasUpgrade("sh", 11) },
            effect() {
                eff = new Decimal(player.sh.points.add(2).pow(5))
                return eff
            },
            effectDisplay() { return "*" + format(tmp.sh.upgrades[11].effect) + " to corrupt politician gain and *" + format(tmp.sh.upgrades[11].effect.log10().add(1).log10().add(1)) + " to inflation generation speed"}
		},
        12:{
            title: "Real Boost",
            description: "Unlock a share effect",
            cost() { return new Decimal(0) },
            unlocked() { return (hasUpgrade("sh", 11) && player.sh.points.gte(1)) || hasUpgrade("sh", 12) },
        },
        13:{
            title: "Inflated Shares",
            description: "Inflation boosts share gain",
            cost() { return new Decimal(2) },
            unlocked() { return (hasUpgrade("sh", 11) && player.sh.points.gte(2)) || hasUpgrade("sh", 13) },
            effect() {
                eff = new Decimal(player.i.layer).add(1).log10().add(1)
                return eff
            },
            effectDisplay() { return "*" + format(tmp.sh.upgrades[13].effect) + " to share gain"}
		},
        14:{
            title: "Corrupt Shares",
            description: "Corruption boosts share gain",
            cost() { return new Decimal(25) },
            unlocked() { return (hasUpgrade("sh", 11) && hasMilestone("sh", 2)) || hasUpgrade("sh", 14) },
            effect() {
                eff = new Decimal(player.p.points).add(1).log10().add(1).pow(1/3)
                return eff
            },
            effectDisplay() { return "*" + format(tmp.sh.upgrades[14].effect) + " to share gain"}
		},
        15:{
            title: "Upgraded Shares",
            description: "Unlock a whole lot of upgrades",
            cost() { return new Decimal(1000) },
            unlocked() { return hasMilestone("sh", 3) || hasUpgrade("sh", 15) },
		},
        21:{
            title: "Do You Want To Suffer",
            description: "Unlock another challenge",
            cost() { return new Decimal(50000) },
            unlocked() { return hasUpgrade("b", 55) || hasUpgrade("sh", 21) },
		},
        22:{
            title: "Sharing Shares",
            description: "4th share challenge's reward is 20% better",
            cost() { return new Decimal("1e24") },
            unlocked() { return hasMilestone("sh", 4) || hasUpgrade("sh", 22) },
		},
        23:{
            title: "Electric Chairs ( Oops made a totally not intentional spelling error )",
            description: "Shares boost electricity gain",
            cost() { return new Decimal("1e50") },
            unlocked() { return hasMilestone("sh", 4) || hasUpgrade("sh", 22) },
            effect() {
                eff = new Decimal(10).pow(player.sh.points.add(1).log10().pow(5))
                if(eff.gte("1e1000000000")) eff = eff.log10().pow(1000000000/9)
                return eff
            },
            effectDisplay() { return "*" + format(tmp.sh.upgrades[23].effect) + " to electricity gain" }
		},
        24:{
            title: "Sharing Even More Shares",
            description: "4th share challenges's reward is better",
            cost() { return new Decimal("1e62") },
            unlocked() { return hasUpgrade("sh", 23) || hasUpgrade("sh", 24) },
		},
        25:{
            title: "The Other One",
            description: "You can now gain both capitalists and communists",
            cost() { 
                if(tmp.cap.requires.eq(new Decimal(10).tetrate("1.79e308"))) return new Decimal("1e1221")
                if(tmp.com.requires.eq(new Decimal(10).tetrate("1.79e308"))) return new Decimal("2e2222")
                return new Decimal(0)
            },
            unlocked() { return hasUpgrade("cap", 15) || hasMilestone("com", 2) || hasUpgrade("sh", 25) },
            onPurchase() {
                if(this.cost.eq("1e1221")) player.com.first = true
                if(this.cost.eq("2e2222")) player.cap.first = true
            }
		},
        31:{
            title: "Full Power",
            description: "Capitalists and communists both act as if chose them first and share gain is 10x greater",
            cost() { return new Decimal(0) },
            unlocked() { return (player.cap.first ? (player.cap.points.gte(15) && player.com.points.gte(7)):(player.cap.points.gte(11) && player.com.points.gte(12))) || hasUpgrade("sh", 31) },
            onPurchase() {
                player.com.first = true
                player.cap.first = true
            }
		},
        32:{
            title: "What Do These Numbers Even Mean ?",
            description: "Shares boost corrupt goverment gain",
            cost() { return new Decimal("1e4000") },
            unlocked() { return player.cb.unlocked || hasUpgrade("sh", 23) },
            effect() {
                eff = new Decimal(player.sh.points.add(1).pow(0.1))
                return eff
            },
            effectDisplay() { return "*" + format(tmp.sh.upgrades[32].effect) + " to corrupt goverment gain" }
		},
    },
    challenges: {
		11: {
			name: "Inflationless",
			challengeDescription: "The title gives you all the information you need",
			goalDescription: "e280,000,000,000 KWh",
			rewardDescription() {return (hasChallenge("sh", 11) ? "You think you deserve a reward for this ?":"Unknown")},
			unlocked() { return hasUpgrade("sh", 21) || inChallenge("sh", 11) || hasChallenge("sh", 11) },
			canComplete() { return player.points.gte("e280000000000")},
		},
        12: {
			name: "Batteryless",
			challengeDescription: "The title still gives you all the information you need",
			goalDescription: "e10,000,000,000 KWh",
			rewardDescription() {return (hasChallenge("sh", 12) ? "You don't deserve any reward":"Unknown")},
			unlocked() { return hasChallenge("sh", 11) || inChallenge("sh", 12) || hasChallenge("sh", 12) },
			canComplete() { return player.points.gte("e10000000000")},
		},
        21: {
			name: "Powerless",
			challengeDescription: "The title still gives you all the information you need",
			goalDescription: "e24,300,000,000 KWh",
			rewardDescription() {return (hasChallenge("sh", 21) ? "Reward ? Nah":"Unknown")},
			unlocked() { return hasChallenge("sh", 12) || inChallenge("sh", 21) || hasChallenge("sh", 21) },
			canComplete() { return player.points.gte("e24300000000")},
		},
        22: {
			name: "Hopeless",
			challengeDescription: "The three previous ones at the same time",
			goalDescription: "e1,510,000,000 KWh",
            countsAs: [11, 12, 21],
			rewardDescription() {return (hasChallenge("sh", 22) ? "Alright, you can get a bonus<br>Shares boost share gain":"Unknown")},
            rewardEffect() { 
                eff = new Decimal(1)
                if(hasUpgrade("sh", 22)) eff = eff.times(player.sh.points.pow(0.9))
                else eff = eff.times(player.sh.points.pow(0.75))
                if(hasUpgrade("sh", 24)) eff = eff.times(player.sh.points.add(1).log10().pow(20).add(1))
                return eff.max(1)
            },
            rewardDisplay() { return (hasChallenge("sh", 22) ? "*" + format(tmp.sh.challenges[22].rewardEffect) + " to share gain":"Unknown") },
			unlocked() { return hasChallenge("sh", 21) || inChallenge("sh", 22) || hasChallenge("sh", 22) },
			canComplete() { return player.points.gte("e1510000000")},
		},
        31: {
			name: "Heartless",
			challengeDescription: "Reset all progress on rows 1-3 and corrupt politicians and governments ( Also Resets When Completing The Challenge )<br>Satan's Masterpiece completions will remain because I'm not THAT heartless",
			goalDescription: "e3e12 Money",
			rewardDescription() {return hasChallenge("sh", 31) ? "Boost share gain based on money":"Unknown"},
            rewardEffect() { 
                eff = new Decimal(1000).pow(player.m.points.add(1).log10().add(1).log10())
                if(eff.gte("1e1000")) eff = eff.log10().pow(1000/3)
                return eff.max(1)
            },
            rewardDisplay() { return hasChallenge("sh", 31) ? "*" + format(tmp.sh.challenges[31].rewardEffect) + " to share gain":"Unknown" },
			unlocked() { return player.m.best.gte("e3e12") || inChallenge("sh", 31) || hasChallenge("sh", 31) },
			canComplete() { return player.m.points.gte("e3e12")},
		},
	},
	milestones: {
		0: {
			requirementDescription: "1 Share",
			done() { return player.sh.best.gte(1) },
			effectDescription: "Keep all row 3 challenges",
		},
        1: {
			requirementDescription: "10 Shares",
			done() { return player.sh.best.gte(10) },
			effectDescription: "Keep all row 3 milestones and unlock aotu buy max for all row 3 currencies",
		},
        2: {
			requirementDescription: "25 Shares",
			done() { return player.sh.best.gte(25) },
			effectDescription: "Keep all row 3 buyables",
		},
        3: {
			requirementDescription: "100 Shares",
			done() { return player.sh.best.gte(100) },
			effectDescription: "Keep worker upgrades",
		},
        4: {
			requirementDescription: "1e15 Shares",
			done() { return player.sh.best.gte("1e15") },
			effectDescription: "Gain 100% of shares on reset every second",
		},
        5: {
			requirementDescription: "1e600 Shares",
			done() { return player.sh.best.gte("1e600") },
			effectDescription: "Keep all row 3 upgrades and battery buyables on reset",
		},
	},
})
addLayer("com", {
    tabFormat: {
        "Main":{
            content: [
                "main-display",
                "prestige-button"
            ],
        },
        "Upgrades":{
            content: [
                "main-display",
                "upgrades"
            ],
        },
        "Milestones":{
            content: [
                "main-display",
                "milestones"
            ],
            unlocked() { return hasMilestone("com", 0) }
        },
    },
    name: "communists", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "COM", // This appears on the layer's node. Default is the id with the first letter capitalized
    row: 4, // Row the layer is in on the tree (0 is the first row)
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    color: "#c83d64",
	branches: ["sh"],
    hotkeys: [
        {key: "L", description: "Press SHIFT+L to Communist Reset", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return hasUpgrade("sh", 24) || player.com.unlocked },
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
        best: new Decimal(0),
        total: new Decimal(0),
        first: 0,
        auto: false,
        pseudoUpgs: [],
    }},
    requires() { return (player.cap.unlocked && (player.com.first == 0 && player.cap.first == 1) ? (hasUpgrade("sh", 25) ? new Decimal("1e2200"):new Decimal(10).tetrate("1.79e308")):new Decimal("1e600")) }, // Can be a function that takes requirement increases into account
    resource: "communists", // Name of prestige currency
    baseResource: "shares", // Name of resource prestige is based on
    baseAmount() {return player.sh.points}, // Get the current amount of baseResource
    type() {return "static"}, // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent() { // Prestige currency exponent
        exp = new Decimal(1.25)
        return exp
    },
    base() {
        base = new Decimal("1e100")
        if(hasUpgrade("g", 33)) base = base.pow(0.9)
        return base
    },
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if(hasUpgrade("cb", 21)) mult = mult.div(tmp.cb.upgrades[21].effect)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        exp = new Decimal(1)
        return exp
    },
	effect() {
		eff = new Decimal(1)
        eff = eff.times(new Decimal("1e100000000").pow(player.com.points))
		return eff
	},
	effectDescription() {
        return "Which Are Multiplying Worker Gain By " + format(tmp.com.effect) + "x"
    },
    resetsNothing() { return hasMilestone("cb", 2) },
    doReset(resettingLayer){
        let keep = []
        if (hasMilestone("cb", 0)) keep.push("milestones")
        if (hasMilestone("cb", 1)) keep.push("upgrades")
        if (layers[resettingLayer].row > this.row) layerDataReset(this.layer, keep)
    },
    upgrades: {
        11:{
            title: "Shared Workers",
            description: "Workers boost share gain",
            cost() { return new Decimal(1) },
            unlocked() { return player.com.unlocked || hasUpgrade("com", 11) },
            effect() {
                eff = new Decimal(player.w.points.add(1).log10())
                return eff.max(1)
            },
            effectDisplay() { return "*" + format(tmp.com.upgrades[11].effect) + " to share gain"}
		},
        12:{
            title: "Share Your Shares",
            description: "Communists are stronger together<br>Boost share gain based on them",
            cost() { return new Decimal(2) },
            unlocked() { return hasUpgrade("com", 11) || hasUpgrade("com", 12) },
            effect() {
                eff = new Decimal(player.com.points.add(10).pow(15))
                return eff
            },
            effectDisplay() { return "*" + format(tmp.com.upgrades[12].effect) + " to share gain"}
		},
        13:{
            title: "More Upgades",
            description: "Unlock more worker upgrades",
            cost() { 
                if(player.cap.first && !player.com.first) return new Decimal(4)
                return new Decimal(3) 
            },
            unlocked() { return hasUpgrade("com", 12) || hasUpgrade("com", 13) },
		},
        14:{
            title: "Nuclear Boost",
            description: "All nuclear buyables are 5x stronger",
            cost() { return new Decimal(4) },
            unlocked() { return getBuyableAmount("s", 11).gte(10) || hasUpgrade("com", 14) },
		},
        15:{
            title: "Nuclear Apocalypse",
            description: "Nuclear power plant base is 95% lower",
            cost() { 
                if(player.cap.first && !player.com.first) return new Decimal(5)
                return new Decimal(4) 
            },
            unlocked() { return hasUpgrade("com", 14) || hasUpgrade("com", 15) },
		},
    },
    milestones: {
		0: {
			requirementDescription: "1 Communist",
			done() { return player.com.best.gte(1) },
			effectDescription: "Keep share milestones",
		},
        1: {
			requirementDescription: "2 Communists",
			done() { return player.com.best.gte(2) },
			effectDescription: "Keep share challenges",
		},
        2: {
			requirementDescription: "5 Communists",
			done() { return player.com.best.gte(5) },
			effectDescription: "Keep share upgrades",
		},
    },
})
addLayer("cap", {
    tabFormat: {
        "Main":{
            content: [
                "main-display",
                "prestige-button"
            ],
        },
        "Upgrades":{
            content: [
                "main-display",
                "upgrades"
            ],
        },
        "Milestones":{
            content: [
                "main-display",
                "milestones"
            ],
            unlocked() { return hasMilestone("cap", 0) }
        },
    },
    name: "capitalists", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "CAP", // This appears on the layer's node. Default is the id with the first letter capitalized
    row: 4, // Row the layer is in on the tree (0 is the first row)
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    color: "#459ec4",
	branches: ["sh"],
    hotkeys: [
        {key: "R", description: "Press SHIFT+R to Capitalist Reset", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return hasUpgrade("sh", 24) || player.cap.unlocked},
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
        best: new Decimal(0),
        total: new Decimal(0),
        first: 0,
        auto: false,
        pseudoUpgs: [],
    }},
    requires() { return (player.com.unlocked && (player.cap.first == 0 && player.com.first == 1) ? (hasUpgrade("sh", 25) ? new Decimal("1e1200"):new Decimal(10).tetrate("1.79e308")):new Decimal("1e600")) }, // Can be a function that takes requirement increases into account
    resource: "capitalists", // Name of prestige currency
    baseResource: "shares", // Name of resource prestige is based on
    baseAmount() {return player.sh.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent() { // Prestige currency exponent
        exp = new Decimal(1.25)
        return exp
    },
    base() {
        base = new Decimal("1e100")
        if(hasUpgrade("g", 33)) base = base.pow(0.9)
        return base
    },
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if(hasUpgrade("cap", 13)) mult = mult.div(tmp.cap.upgrades[13].effect)
        if(hasUpgrade("cb", 22)) mult = mult.div(tmp.cb.upgrades[22].effect)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        exp = new Decimal(1)
        return exp
    },
	effect() {
		eff = new Decimal(1)
        eff = eff.times(new Decimal("1ee9").pow(player.cap.points))
        if(hasUpgrade("m", 81)) eff = eff.pow(tmp.m.upgrades[81].effect)
		return eff
	},
	effectDescription() {
        return "Which Are Multiplying Money Gain By " + format(tmp.cap.effect) + "x" + (hasUpgrade("m", 83) ? " And Multiplying Electricity Gain By " + format(tmp.cap.effect.pow(0.1)) + "x":"")
	},
    resetsNothing() { return hasMilestone("cb", 2) },
    doReset(resettingLayer){
        let keep = []
        if (hasMilestone("cb", 0)) keep.push("milestones")
        if (hasMilestone("cb", 1)) keep.push("upgrades")
        if (layers[resettingLayer].row > this.row) layerDataReset(this.layer, keep)
    },
    upgrades: {
        11:{
            title: "Capitalism",
            description: "Capitalists boost share gain",
            cost() { return new Decimal(1) },
            unlocked() { return player.cap.unlocked || hasUpgrade("cap", 11) },
            effect() {
                if(hasUpgrade("cap", 12)) eff = new Decimal("1e15").pow(player.cap.points.max(1).pow(0.85))
                else eff = new Decimal("1e10").pow(player.cap.points.max(1).pow(0.8))
                return eff
            },
            effectDisplay() { return "*" + format(tmp.cap.upgrades[11].effect) + " to share gain"}
		},
        12:{
            title: "Capitalism+",
            description: "Capitalism uses a stronger formula and it also boosts corrupt government gain",
            cost() { return new Decimal(2) },
            unlocked() { return hasUpgrade("cap", 11) || hasUpgrade("cap", 12) },
		},
        13:{
            title: "Compound Interest",
            description: "Capitalists divides their own cost",
            cost() { return new Decimal(5) },
            unlocked() { return hasUpgrade("cap", 12) || hasUpgrade("cap", 13) },
            effect() {
                eff = new Decimal("1e25").pow(player.cap.points.add(1).pow(0.95))
                return eff
            },
            effectDisplay() { return "/" + format(tmp.cap.upgrades[13].effect) + " to capitalist cost"}
		},
        14:{
            title: "Capital Boost",
            description: "Unlock ??? new upgrades",
            cost() { return new Decimal(7) },
            unlocked() { return hasUpgrade("cap", 13) || hasUpgrade("cap", 14) },
		},
        15:{
            title: "Extra Capital",
            description: "Boost corrupt politician gain based on capitalists and capitalists upgrades",
            cost() { return new Decimal(10) },
            unlocked() { return hasUpgrade("m", 81) || hasUpgrade("cap", 15) },
            effect() {
                eff = new Decimal(player.cap.points.add(1).pow(new Decimal(player.cap.upgrades.length).add(1).pow(5)))
                return eff
            },
            effectDisplay() { return "*" + format(tmp.cap.upgrades[15].effect) + " to corrupt politician gain"}
		},
    },
    milestones: {
		0: {
			requirementDescription: "1 Capitalist",
			done() { return player.cap.best.gte(1) },
			effectDescription: "Keep share milestones",
		},
        1: {
			requirementDescription: "2 Capitalists",
			done() { return player.cap.best.gte(2) },
			effectDescription: "Keep share challlenges",
		},
        2: {
			requirementDescription: "5 Capitalists",
			done() { return player.cap.best.gte(5) },
			effectDescription: "Keep share upgrades",
		},
    },
})
addLayer("cb", {
    tabFormat: {
        "Main":{
            content: [
                "main-display",
                "prestige-button"
            ],
        },
        "Upgrades":{
            content: [
                "main-display",
                "upgrades"
            ],
        },
        "Milestones":{
            content: [
                "main-display",
                "milestones"
            ],
            unlocked() { return hasMilestone("cb", 0) }
        },
        "Softcaps":{
            content: [
                "main-display",
                ["display-text", function() { 
                    let text = ""
                    if(player.cb.best.gte(10)) text = text + "10 Corrupt Boosts : Base Cost Exp 1.25 --> 1.5<br><br>"
                    if(player.cb.best.gte(25)) text = text + "25 Corrupt Boosts : Base Cost Exp 1.5 --> 2<br><br>"
                    return text
                },]
            ],
            unlocked() { return player.cb.best.gte(10) }
        },
    },
    name: "corrupt boosts", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "CB", // This appears on the layer's node. Default is the id with the first letter capitalized
    row: 5, // Row the layer is in on the tree (0 is the first row)
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    color: "#3836b6",
	branches: ["com", "cap"],
    hotkeys: [
        {key: "B", description: "Press SHIFT+B to Corrupt Boost Reset", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return player.cap.points.add(player.com.points).gte(30) || player.cb.unlocked},
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
        best: new Decimal(0),
        total: new Decimal(0),
        power: new Decimal(0),
        first: 0,
        auto: false,
        pseudoUpgs: [],
    }},
    requires() { return new Decimal(30) }, // Can be a function that takes requirement increases into account
    resource: "corrupt boosts", // Name of prestige currency
    baseResource: "communists and capitalists", // Name of resource prestige is based on
    baseAmount() {return player.cap.points.add(player.com.points)}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent() { // Prestige currency exponent
        exp = new Decimal(1.25)
        if(player.cb.points.gte(10)) exp = exp.add(0.25)
        if(player.cb.points.gte(25)) exp = exp.add(0.5)
        return exp
    },
    base() {
        base = new Decimal(1.01)
        return base
    },
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if(hasUpgrade("cb", 14)) mult = mult.times(0.95)
        if(hasUpgrade("g", 32)) mult = mult.div(tmp.g.upgrades[32].effect)
        if(hasUpgrade("g", 34)) mult = mult.times(0.99)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        exp = new Decimal(1)
        return exp
    },
	effect() {
		eff = new Decimal(1)
        eff = eff.times(player.cb.points.times(tmp.cb.powerEffect).add(1).log10().add(1).pow(0.2))
        if(hasUpgrade("cb", 13)) eff = eff.pow(1.5)
		return eff
	},
    powerEffect() {
        eff = new Decimal(1)
        eff = eff.times(player.cb.power.add(1).log10().add(1).pow(0.2))
        if(hasUpgrade("cb", 13)) eff = eff.pow(1.5)
        if(hasUpgrade("cb", 15)) eff = eff.pow(tmp.cb.upgrades[15].effect)
        return eff
    },
	effectDescription() {
        return ("Which Are Raising Corrupt Goverment Gain And Their Effect To The " + format(tmp.cb.effect) + "th Power<br><br><br>You have " + format(player.cb.power) + " Corrupt Power, Making Corrupt Boosts " + format(tmp.cb.powerEffect) + "x More Efficient")
	},
    resetsNothing() { return hasMilestone("cb", 3) },
    doReset(resettingLayer){
        let keep = []
        if (layers[resettingLayer].row > this.row) layerDataReset(this.layer, keep)
    },
    upgrades: {
        11:{
            title: "Corrupt Power",
            description: "Corrupt boosts produce corrupt power, which increases the corrupt boost effect, but only when you are in the corrupt boosts tab",
            cost() { return new Decimal(1) },
            unlocked() { return (player.cb.unlocked && player.cap.points.add(player.com.points).gte(30)) || hasUpgrade("cb", 11) },
		},
        12:{
            title: "I Need More Power",
            description: "Corrupt power boosts its own generation",
            cost() { return new Decimal(1) },
            unlocked() { return (player.cb.unlocked && hasUpgrade("cb", 11) && player.cap.points.add(player.com.points).gte(30)) || hasUpgrade("cb", 12) },
            effect() {
                eff = new Decimal(player.cb.power.add(1).log10().add(1).pow(3))
                return eff
            },
            effectDisplay() { return "*" + format(tmp.cb.upgrades[12].effect) + " to corrupt power gain"}
		},
        13:{
            title: "The Corruption Is Everywhere",
            description: "Corrupt boosts and corrupt power are 50% stronger",
            cost() { return new Decimal(1) },
            unlocked() { return (player.cb.unlocked && hasUpgrade("cb", 12) && player.cap.points.add(player.com.points).gte(30)) || hasUpgrade("cb", 13) },
		},
        14:{
            title: "Black Friday",
            description: "Corrupt boosts are 5% cheaper",
            cost() { return new Decimal(1) },
            unlocked() { return (player.cb.unlocked && hasUpgrade("cb", 13) && player.cap.points.add(player.com.points).gte(30)) || hasUpgrade("cb", 14) },
		},
        15:{
            title: "Boostin'",
            description: "Corrupt power is stronger based on its own amount",
            cost() { return new Decimal(3) },
            unlocked() { return player.cb.points.gte(2) || hasUpgrade("cb", 15) },
            effect() {
                eff = new Decimal(player.cb.power.add(1).log10().add(1).log10().add(1))
                return eff
            },
            effectDisplay() { return "+" + format(tmp.cb.upgrades[15].effect.minus(1).times(100)) + "% stronger"}
		},
        21:{
            title: "To Show You The Power Of Flex Tape",
            description: "Corrupt boosts make communists cheaper",
            cost() { return new Decimal(4) },
            unlocked() { return hasUpgrade("cb", 15) || hasUpgrade("cb", 21) },
            effect() {
                eff = new Decimal(2).pow(player.cb.points.times(100).pow(1.1))
                return eff
            },
            effectDisplay() { return "/" + format(tmp.cb.upgrades[21].effect) + " communist cost"}
		},
        22:{
            title: "I Sawed This Upgrade In Half",
            description: "Corrupt boosts make capitalists cheaper",
            cost() { return new Decimal(5) },
            unlocked() { return hasUpgrade("cb", 21) || hasUpgrade("cb", 22) },
            effect() {
                eff = new Decimal(2).pow(player.cb.points.times(100).pow(1.1))
                return eff
            },
            effectDisplay() { return "/" + format(tmp.cb.upgrades[22].effect) + " capitalist cost"}
		},
        23:{
            title: "Useful Corruption",
            description: "The corrupt government effect gets better because why not and corrupt politicians boost share gain",
            cost() { return new Decimal(10) },
            unlocked() { return hasUpgrade("cb", 22) || hasUpgrade("cb", 23) },
            effect() {
                eff = new Decimal(10).pow(player.p.points.add(1).log10().pow(0.25))
                return eff
            },
            effectDisplay() { return "*" + format(tmp.cb.upgrades[23].effect) + " share gain"}
		},
        24:{
            title: "I uhhh... whatever, this is an upgrade",
            description: "Centuple the share gain exponent",
            cost() { return new Decimal(20) },
            unlocked() { return hasUpgrade("g", 34) || hasUpgrade("cb", 24) },
		},
        25:{
            title: "This isn't a placeholder anymore ?<br>Well, I don't care",
            description: "Battery base is 99.9% weaker and solar power plant base is 40% weaker",
            cost() { return new Decimal(25) },
            unlocked() { return hasUpgrade("g", 34) || hasUpgrade("cb", 25) },
		},
    },
    milestones: {
		0: {
			requirementDescription: "1 Corrupt Boost",
			done() { return player.cb.best.gte(1) },
			effectDescription: "Keep row 5 milestones",
		},
        1: {
			requirementDescription: "3 Corrupt Boosts",
			done() { return player.cb.best.gte(3) },
			effectDescription: "Keep row 5 upgrades",
		},
        2: {
			requirementDescription: "4 Corrupt Boosts",
			done() { return player.cb.best.gte(4) },
			effectDescription: "Row 5 layers reset nothing",
		},
        3: {
			requirementDescription: "20 Corrupt Boosts",
			done() { return player.cb.best.gte(20) },
			effectDescription: "Corrupt boosts reset nothing",
		},
    },
    update(diff) {
        if(hasUpgrade("cb", 11)) {
            let gain = player.cb.points.add(1).log10().add(1).pow(5).minus(1)
            if(hasUpgrade("cb", 12)) gain = gain.times(tmp.cb.upgrades[12].effect)
            gain = gain.times(diff)
            if(player.tab == "cb") player.cb.power = player.cb.power.add(gain)
        }
    },
})
addLayer("p", {
    tabFormat: {
        "Upgrades":{
            content: [
                "main-display",
                "upgrades"
            ],
        },
        "Buyables":{
            content: [
                "main-display",
                "buyables"
            ],
            unlocked() { return tmp.p.buyables[11].unlocked }
        },
    },
    name: "corrupt politicians", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "P", // This appears on the layer's node. Default is the id with the first letter capitalized
    row: "side", // Row the layer is in on the tree (0 is the first row)
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    color: "#3836b6",
    layerShown(){return hasUpgrade("m", 55) || player.p.unlocked},
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
        best: new Decimal(0),
        total: new Decimal(0),
        first: 0,
        auto: false,
        pseudoUpgs: [],
    }},
    requires() { return new Decimal("1e700000") }, // Can be a function that takes requirement increases into account
    resource: "corrupt politicians", // Name of prestige currency
    baseResource: "money", // Name of resource prestige is based on
    baseAmount() {return player.m.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent() { // Prestige currency exponent
		exp = new Decimal(1).div("1e9")
		return exp
	},
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if(hasUpgrade("p", 14)) mult = mult.times(tmp.p.effect.pow(4))
        if(hasUpgrade("p", 34)) mult = mult.times(tmp.p.upgrades[34].effect)
        if(hasUpgrade("c", 23)) mult = mult.times(5)
        if(hasUpgrade("g", 12)) mult = mult.times(tmp.g.upgrades[12].effect)
        if(hasUpgrade("i", 14)) mult = mult.times(tmp.i.upgrades[14].effect)
        if(hasUpgrade("sh", 11)) mult = mult.times(tmp.sh.upgrades[11].effect)
        if(hasUpgrade("cap", 15)) mult = mult.times(tmp.cap.upgrades[15].effect)
        if(hasUpgrade("m", 74)) mult = mult.times(tmp.m.upgrades[74].effect)
        if(hasUpgrade("g", 25)) mult = mult.times(tmp.g.upgrades[25].effect)
        if(hasChallenge("n", 22)) mult = mult.times(tmp.n.challenges[22].rewardEffect)
        mult = mult.times(tmp.n.buyables[11].effect)
        mult = mult.times(tmp.g.effect)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        exp = new Decimal(1)
        if(hasUpgrade("i", 42)) exp = exp.times(tmp.i.upgrades[42].effect)
        return exp
    },
	effect() {
        if(inChallenge("s", 11) || inChallenge("s", 12)) {
            return new Decimal(1)
        }
		eff = new Decimal(1)
        eff = eff.add(player.p.points.add(1).log(10).add(1).log10())
        if(hasUpgrade("p", 22)) eff = eff.pow(1.25)
        if(hasUpgrade("p", 25)) eff = eff.pow(2)
        if(hasUpgrade("p", 41)) eff = eff.pow(3)
        if(hasUpgrade("m", 84)) eff = eff.pow(tmp.m.upgrades[84].effect)
        if(inChallenge("n", 22)) {
            eff = eff.minus(1)
        }
        if(!hasUpgrade("c", 23)) {
            if(hasUpgrade("p", 22)) {
                return eff.min(2)
            }
            if(hasUpgrade("p", 13)) {
                return eff.min(1.75)
            }
            return eff.min(1.5)
        }
        if(eff.gte(2) && !hasUpgrade("g", 14)) {
            if(hasUpgrade("p", 32)) {
                if(eff.gte(2.5)) eff = eff.log10().minus(new Decimal(2.5).log10()).add(2.5)
            } 
            else eff = eff.log10().minus(new Decimal(2).log10()).add(2)
        }
        if(eff.gte(3) && !hasUpgrade("g", 23)) {
            eff = eff.minus(2).pow(0.5).add(2)
        }
        if(eff.gte(5) && !hasUpgrade("m", 72)) {
            eff = eff.log10().minus(new Decimal(5).log10()).add(1).pow(0.25).add(4)
        }
        if(eff.gte(8) && !hasUpgrade("g", 25)) {
            eff = eff.minus(8).pow(2/3).add(1).pow(0.25).add(7)
        }
        if(eff.gte(10) && !hasUpgrade("p", 44)) {
            eff = eff.log10().minus(new Decimal(10).log10()).add(1).pow(0.1).add(9)
        }
        if(eff.gte(15) && !hasUpgrade("p", 45)) {
            eff = eff.log10().minus(new Decimal(15).log10()).add(1).pow(0.85).add(14)
        }
        if(eff.gte(20) && !hasUpgrade("p", 51)) {
            eff = eff.minus(19).pow(0.1).add(19)
        }
        if(eff.gte(25)) {
            eff = eff.minus(24).pow(0.001).add(24)
        }
        if(eff.gte(30)) {
            eff = eff.minus(29).pow(0.000001).add(29)
        }
        if(eff.gte(50)) {
            eff = eff.minus(49).pow(1/3).add(49)
        }
        if(eff.gte(250)) {
            eff = eff.minus(249).pow(0.5).add(249)
        }
        return eff
	},
	effectDescription() {
        if(hasUpgrade("p", 14)) {
            return "Which Are Raising Electricity Gain To The "+format(tmp.p.effect)+"th power And Boosting Corrupt Politician Gain By "+format(tmp.p.effect.pow(4))+"x"
        }
		return "Which Are Raising Electricity Gain To The "+format(tmp.p.effect)+"th power"
	},
    passiveGeneration() { return player.p.unlocked },
    doReset(resettingLayer){
        let keep = []
        if (layers[resettingLayer].row > this.row) layerDataReset(this.layer, keep)
    },
    upgrades: {
        11: {
            title: "Who Cares About Pollution ?",
            description: "Corrupt politicians reduce coal power plant cost exponent",
            cost() { return new Decimal(100) },
            unlocked() { return player.p.points.gte(0) || hasUpgrade("p", 11) },
            effect() { 
				return new Decimal(player.p.points.add(1).log10().add(1).log10().pow(1/3).min(2))
            },
            effectDisplay() { return "-"+format(tmp.p.upgrades[11].effect) + " to coal power plant cost exponent" },
        },
        12: {
            title: "Who Cares About Radioactivity ?",
            description: "Corrupt politicians reduce nuclear power plant cost exponent",
            cost() { return new Decimal(150) },
            unlocked() { return hasUpgrade("p", 11) || hasUpgrade("p", 12) },
            effect() { 
				return new Decimal(player.p.points.add(1).log10().add(1).log10().pow(1/3).times(1.5).min(2))
            },
            effectDisplay() { return "-"+format(tmp.p.upgrades[12].effect) + " to nuclear power plant cost exponent" },
        },
        13: {
            title: "I Hate Hardcaps",
            description: "Push corrupt politicians effect hardcap to 1.75",
            cost() { return new Decimal(250) },
            unlocked() { return hasUpgrade("p", 11) || hasUpgrade("p", 13) },
        },
        14: {
            title: "Need More Effects",
            description: "Unlock another corrupt politician effect",
            cost() { return new Decimal(400) },
            unlocked() { return hasUpgrade("p", 13) || hasUpgrade("p", 14) },
        },
        15: {
            title: "Need More Power",
            description: "Global demand on electricity rises, the government reduces by 1 the nuclear power plant cost exponent to satisfy the demand",
            cost() { return new Decimal(2000) },
            unlocked() { return hasUpgrade("p", 14) || hasUpgrade("p", 15) },
        },
        21: {
            title: "Back To Hell",
            description: "Unlock the fourth nuclear challenge",
            cost() { return new Decimal(3000) },
            unlocked() { return hasUpgrade("n", 14) || hasUpgrade("p", 21) },
        },
        22: {
            title: "Boosting And Boosting Again",
            description: "Raise corrucpt politicians effect to the 1.25th power and raise the hardcap to 2",
            cost() { return new Decimal(10000) },
            unlocked() { return hasChallenge("n", 22) || hasUpgrade("p", 22) },
        },
        23: {
            title: "More Corruption = Cheaper",
            description: "Corrupt politicians reduce nuclear power plant cost",
            cost() { return new Decimal(100000) },
            unlocked() { return hasUpgrade("p", 22) || hasUpgrade("p", 23) },
            effect() {
                return new Decimal(player.p.points).pow(player.p.points.log10()).pow(6000)
            },
            effectDisplay() { return "/"+format(tmp.p.upgrades[23].effect) + " to nuclear power plant cost" },
        },
        24: {
            title: "Maybe Ecology Is Future ?",
            description: "Unlock another layer",
            cost() { return new Decimal(250000) },
            unlocked() { return hasUpgrade("n", 21) || hasUpgrade("p", 24) },
        },
        25: {
            title: "Political Boost",
            description: "Square corrupt politician effect",
            cost() { return new Decimal(1000000) },
            unlocked() { return hasUpgrade("c", 23) || hasUpgrade("p", 25) },
        },
        31: {
            title: "Hell Remastered",
            description: "Unlock solar power plant challenges",
            cost() { return new Decimal("2.5e9") },
            unlocked() { return hasUpgrade("s", 14) || hasUpgrade("p", 31) },
        },
        32: {
            title: "Go Further",
            description: "The first sofcap of the corrupt politician effect starts later",
            cost() { return new Decimal("1e16") },
            unlocked() { return hasUpgrade("g", 12) || hasUpgrade("p", 32) },
        },
        33: {
            title: "Base Destroyer",
            description: "Unlock another battery buyable",
            cost() { return new Decimal("1e18") },
            unlocked() { return hasUpgrade("g", 12) || hasUpgrade("p", 33) },
        },
        34: {
            title: "Corrupt Corruption",
            description: "Corrupt politicians corrupt other politicians",
            cost() { return new Decimal("1e95") },
            unlocked() { return hasUpgrade("i", 43) || hasUpgrade("p", 34) },
            effect() {
                eff = new Decimal(player.p.points.pow(1/3))
                return eff.max(1)
            },
            effectDisplay() {return "*"+format(tmp.p.upgrades[34].effect)+" to corrupt politician gain"},
        },
        35: {
            title: "Inflated Corruption",
            description: "Boost inflation gain by a factor 5",
            cost() { return new Decimal("1e485") },
            unlocked() { return hasUpgrade("i", 43) || hasUpgrade("p", 35) },
        },
        41: {
            title: "Live TV Fight, Uhh I Mean Debate",
            description: "Corrupt politician effect is cubed",
            cost() { return new Decimal("1e525") },
            unlocked() { return hasUpgrade("i", 43) || hasUpgrade("p", 41) },
        },
        42: {
            title: "Extra Corruption",
            description: "Corrupt politicians boost electricity gain",
            cost() { return new Decimal("1e15400") },
            unlocked() { return hasUpgrade("m", 74) || hasUpgrade("p", 42) },
            effect() {
                eff = new Decimal(player.p.points.pow(1958))
                return eff.max(1)
            },
            effectDisplay() {return "*"+format(tmp.p.upgrades[42].effect)+" to electricity gain"},
        },
        43: {
            title: "Got Some Corruption With You ?",
            description: "Corrupt politicians boost share gain",
            cost() { 
                if(player.com.first && !player.cap.first) return new Decimal("1e60220")
                return new Decimal("1e47400") 
            },
            unlocked() { return hasUpgrade("cap", 14) || hasUpgrade("p", 43) },
            effect() {
                eff = new Decimal(player.p.points.add(1).log10().pow(5))
                return eff
            },
            effectDisplay() {return "*"+format(tmp.p.upgrades[43].effect)+" to share gain"},
        },
        44: {
            title: "HOW MANY SOFTCAPS DO YOU NEED ?",
            description: "Remove the 5th softcap on the corrupt politician effect",
            cost() { 
                if(player.com.first && !player.cap.first) return new Decimal("1e90000")
                return new Decimal("1e75000") 
            },
            unlocked() { return hasUpgrade("cap", 14) || hasUpgrade("p", 44) },
        },
        45: {
            title: "GET RID OF THEM",
            description: "Remove the 6th softcap on the corrupt politician effect and make the 17th inflation upgrade better",
            cost() { return new Decimal("1e230000") },
            unlocked() { return hasUpgrade("g", 32) || hasUpgrade("p", 45) },
        },
    },
    buyables: {
        11: {
            title: "Corrupt Buff 1",
            display() {
                return "Raise electricity gain to the 1.25 th power"
            },
            unlocked() { return inChallenge("s", 12) && getBuyableAmount("p", 12).add(getBuyableAmount("p", 13)).lt(1) },
            canAfford() { 
                return getBuyableAmount("p", 11).lt(1) && getBuyableAmount("p", 12).lt(1) && getBuyableAmount("p", 13).lt(1) 
            },
            buy() { 
                setBuyableAmount("p", 11, getBuyableAmount("p", 11).add(1))
            },
        },
        12: {
            title: "Corrupt Buff 2",
            display() {
                return "Subtract 2.5 from the battery cost base"
            },
            unlocked() { return inChallenge("s", 12) && getBuyableAmount("p", 11).add(getBuyableAmount("p", 13)).lt(1) },
            canAfford() { 
                return getBuyableAmount("p", 11).lt(1) && getBuyableAmount("p", 12).lt(1) && getBuyableAmount("p", 13).lt(1) 
            },
            buy() { 
                setBuyableAmount("p", 12, getBuyableAmount("p", 12).add(1))
            },
        },
        13: {
            title: "Corrupt Buff 3",
            display() {
                return "Multiply by 4/3 the worker gain exponent"
            },
            unlocked() { return inChallenge("s", 12) && getBuyableAmount("p", 11).add(getBuyableAmount("p", 12)).lt(1) },
            canAfford() { 
                return getBuyableAmount("p", 11).lt(1) && getBuyableAmount("p", 12).lt(1) && getBuyableAmount("p", 13).lt(1)
            },
            buy() { 
                setBuyableAmount("p", 13, getBuyableAmount("p", 13).add(1))
            },
        },
        21: {
            title: "Corrupt Nerf 1",
            display() {
                return "Divide by 1.30 the money gain exponent"
            },
            unlocked() { return inChallenge("s", 12) && getBuyableAmount("p", 22).add(getBuyableAmount("p", 23)).lt(1) },
            canAfford() { 
                return getBuyableAmount("p", 21).lt(1) && getBuyableAmount("p", 22).lt(1) && getBuyableAmount("p", 23).lt(1)
            },
            buy() { 
                setBuyableAmount("p", 21, getBuyableAmount("p", 21).add(1))
            },
        },
        22: {
            title: "Corrupt Nerf 2",
            display() {
                return "Add 0.025 to the battery cost exponent"
            },
            unlocked() { return inChallenge("s", 12) && getBuyableAmount("p", 21).add(getBuyableAmount("p", 23)).lt(1) },
            canAfford() { 
                return getBuyableAmount("p", 21).lt(1) && getBuyableAmount("p", 22).lt(1) && getBuyableAmount("p", 23).lt(1)
            },
            buy() { 
                setBuyableAmount("p", 22, getBuyableAmount("p", 22).add(1))
            },
        },
        23: {
            title: "Corrupt Nerf 3",
            display() {
                return "worker gain is raised to the (1-coal power plants/50) th power"
            },
            unlocked() { return inChallenge("s", 12) && getBuyableAmount("p", 21).add(getBuyableAmount("p", 22)).lt(1) },
            canAfford() { 
                return getBuyableAmount("p", 21).lt(1) && getBuyableAmount("p", 22).lt(1) && getBuyableAmount("p", 23).lt(1)
            },
            buy() { 
                setBuyableAmount("p", 23, getBuyableAmount("p", 23).add(1))
            },
        },
    },
})
addLayer("g", {
    tabFormat: {
        "Upgrades":{
            content: [
                "main-display",
                "upgrades"
            ],
        },
    },
    name: "corrupt governments", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "G", // This appears on the layer's node. Default is the id with the first letter capitalized
    row: "side", // Row the layer is in on the tree (0 is the first row)
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    color: "#3836b6",
    layerShown(){return hasUpgrade("m", 64) || player.g.unlocked},
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
        best: new Decimal(0),
        total: new Decimal(0),
        first: 0,
        auto: false,
        pseudoUpgs: [],
    }},
    requires() { return new Decimal(1000000) }, // Can be a function that takes requirement increases into account
    resource: "corrupt governments", // Name of prestige currency
    baseResource: "corrupt polititcians", // Name of resource prestige is based on
    baseAmount() {return player.p.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent() { // Prestige currency exponent
		exp = new Decimal(1).div(new Decimal("1ee9"))
		return exp
	},
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if(hasUpgrade("w", 45)) mult = mult.times(tmp.w.upgrades[45].effect)
        if(hasUpgrade("c", 24)) mult = mult.times(tmp.c.upgrades[24].effect)
        if(hasUpgrade("sh", 32)) mult = mult.times(tmp.sh.upgrades[32].effect)
        if(hasUpgrade("cap", 12)) mult = mult.times(tmp.cap.upgrades[11].effect)
        if(hasUpgrade("g", 24)) mult = mult.times(tmp.g.upgrades[24].effect)
        if(hasUpgrade("i", 12)) mult = mult.times(tmp.i.upgrades[12].effect)
        if(hasUpgrade("i", 13)) mult = mult.times(tmp.i.upgrades[13].effect)
        if(hasUpgrade("i", 31)) mult = mult.times(tmp.i.upgrades[31].effect)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        exp = new Decimal(1)
        if(hasUpgrade("i", 42)) exp = exp.times(tmp.i.upgrades[42].effect)
        exp = exp.times(tmp.cb.effect)
        return exp
    },
	effect() {
        if(inChallenge("s", 11) || inChallenge("s", 12)) {
            return new Decimal(1)
        }
		eff = new Decimal(1)
        eff = eff.times(player.g.points.add(1).log10().add(1).pow(5))
        if(hasUpgrade("g", 21)) eff = eff.pow(10)
        if(hasUpgrade("cb", 23)) eff = new Decimal(10).pow(eff.max(1).log10().pow(2))
        eff = eff.pow(tmp.cb.effect)
        return eff
	},
	effectDescription() {
        return "Which Are Boosting Corrupt Politician Gain By "+format(tmp.g.effect)+"x"
	},
    passiveGeneration() { return player.g.unlocked },
    doReset(resettingLayer){
        let keep = []
        if (layers[resettingLayer].row > this.row) layerDataReset(this.layer, keep)
    },
    upgrades: {
        11: {
            title: "Gain Control",
            description: "Corrupt governments reduce taxes, making solar power plants cheaper",
            cost() { return new Decimal(100) },
            unlocked() { return player.g.points.gte(0) || hasUpgrade("g", 11) },
            effect() { 
				return new Decimal(player.g.points.pow(0.125).min(2))
            },
            effectDisplay() { return "/"+format(tmp.g.upgrades[11].effect) + " to solar power plant cost" },
        },
        12: {
            title: "Corruption-19",
            description: "Spread corruption to the entire world with your corrupt governments",
            cost() { return new Decimal(1000) },
            unlocked() { return maxedChallenge("s", 12) || hasUpgrade("g", 12) },
            effect() { 
				return new Decimal(player.g.points.div(1000).max(1).pow(5).min(1000000))
            },
            effectDisplay() { return "*"+format(tmp.g.upgrades[12].effect) + " to corrupt politician gain" },
        },
        13: {
            title: "Inflated Governments",
            description: "Corrupt governments boost inflation gain",
            cost() { return new Decimal("1e16") },
            unlocked() { return hasUpgrade("i", 13) || hasUpgrade("g", 13) },
            effect() { 
				return new Decimal(player.g.points.add(1).log10().pow(0.25).min(10))
            },
            effectDisplay() { return "^"+format(tmp.g.upgrades[13].effect) + " to inflation gain" },
        },
        14: {
            title: "( Softcapped )",
            description: "Remove the first softcap of the corrupt politician effect",
            cost() { return new Decimal("1e20") },
            unlocked() { return hasUpgrade("i", 21) || hasUpgrade("g", 14) },
        },
        15: {
            title: "( Softcapped ) The Sequel",
            description: "Make the softcap on inflation gain 250x less powerful",
            cost() { return new Decimal("1e83") },
            unlocked() { return hasUpgrade("i", 31) || hasUpgrade("g", 15) },
        },
        21: {
            title: "Effects, Effects, Effects...",
            description: "Raise corrupt government effect to the 10th power",
            cost() { return new Decimal("1e274") },
            unlocked() { return hasUpgrade("i", 43) || hasUpgrade("g", 21) },
        },
        22: {
            title: "Dark Energy",
            description: "Elecrticity boosts inflation generation speed",
            cost() { return new Decimal("1e290") },
            unlocked() { return hasUpgrade("i", 43) || hasUpgrade("g", 22) },
            effect() { 
				return new Decimal(player.points.add(1).log10().add(1).log10().pow(0.5))
            },
            effectDisplay() { return "*"+format(tmp.g.upgrades[22].effect) + " to inflation generation speed" },
        },
        23: {
            title: "( Softcapped ) The End Of The Trilogy",
            description: "Remove the second softcap on corrupt politician effect",
            cost() { return new Decimal("1e315") },
            unlocked() { return hasUpgrade("i", 43) || hasUpgrade("g", 23) },
        },
        24: {
            title: "Self-Corruption",
            description: "Corrupt governments boost their own gain",
            cost() { return new Decimal("1e550") },
            unlocked() { return hasUpgrade("w", 45) || hasUpgrade("g", 24) },
            effect() { 
				return new Decimal(player.g.points.add(1).log10().add(1).pow(4))
            },
            effectDisplay() { return "*"+format(tmp.g.upgrades[24].effect) + " to corrupt government gain" },
        },
        25: {
            title: "Big Ol' Boost",
            description: "Corrupt governments boost corrupt politician gain and remove 4th softcap on corrupt politician effect",
            cost() { return new Decimal("1e565") },
            unlocked() { return hasUpgrade("w", 45) || hasUpgrade("g", 25) },
            effect() { 
				return new Decimal(player.g.points.add(1))
            },
            effectDisplay() { return "*"+format(tmp.g.upgrades[24].effect) + " to corrupt politician gain" },
        },
        31: {
            title: "Shared Corruption",
            description: "Corrupt governments boost share gain",
            cost() { 
                if(player.com.first && !player.cap.first) return new Decimal("1e676")
                return new Decimal("1e660")
            },
            unlocked() { return hasUpgrade("cap", 12) || hasUpgrade("g", 31) },
            effect() { 
				return new Decimal(player.g.points.add(1).log10().add(1))
            },
            effectDisplay() { return "*"+format(tmp.g.upgrades[31].effect) + " to share gain" },
        },
        32: {
            title: "Insert Title Here",
            description: "Corrupt goverments reduces corrupt boost cost",
            cost() { return new Decimal("1e2000") },
            unlocked() { return player.cb.unlocked || hasUpgrade("g", 32) },
            effect() { 
				eff = new Decimal(player.g.points.add(1).log10().add(1).log10().add(1).pow(0.05))
                if(eff.gte(1.25)) eff = eff.minus(0.25).pow(1/3).add(0.25)
                if(eff.gte(2)) eff = eff.minus(1).pow(1/3).add(1)
                if(eff.gte(10)) eff = new Decimal(10)
                return eff
            },
            effectDisplay() { return format(new Decimal(100).minus(new Decimal(100).div(tmp.g.upgrades[32].effect))) + "% cheaper corrupt boosts" },
        },
        33: {
            title: "Really ?",
            description: "Capitalists and communists bases are 10% weaker",
            cost() { return new Decimal("1e2600") },
            unlocked() { return player.cb.best.gte(16) || hasUpgrade("g", 33) },
        },
        34: {
            title: "I Just Don't Care Anymore",
            description: "Unlock new corrupt boost upgrades and corrupt boosts are 1% cheaper",
            cost() { return new Decimal("1e2600") },
            unlocked() { return player.cb.best.gte(19) || hasUpgrade("g", 34) },
        },
        35: {
            title: "Corrupt Hell",
            description: "Corrupt politicians and governments start producing corruption",
            cost() { return new Decimal("1e6666") },
            unlocked() { return player.com.unlocked || player.cap.unlocked || hasUpgrade("g", 35) },
        },
    },
})
addLayer("i", {
    tabFormat: {
        "Upgrades":{
            content: [
                "main-display",
                "upgrades"
            ],
        },
    },
    name: "inflation", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "I", // This appears on the layer's node. Default is the id with the first letter capitalized
    row: "side", // Row the layer is in on the tree (0 is the first row)
    position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    color: "#3836b6",
    layerShown(){return hasUpgrade("s", 15) || player.i.unlocked},
    startData() { return {
        unlocked: false,
        points: new Decimal(1),
        layer: 0,
        mag: 1,
        diff: 0,
        layer_limit: 150000000,
        first: 0,
        auto: false,
        pseudoUpgs: [],
        softcap: false,
    }},
    requires() { return new Decimal(1000000) }, // Can be a function that takes requirement increases into account
    resource: "inflation", // Name of prestige currency
    baseResource: "money", // Name of resource prestige is based on
    baseAmount() {return player.m.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent() { // Prestige currency exponent
		exp = new Decimal(1).div(new Decimal("1e1000000000"))
		return exp
	},
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(0)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        exp = new Decimal(1)
        return exp
    },
	effect() {
		eff = new Decimal(1)
        eff = eff.times(player.m.points.add(1).log10().add(1).log10().div(100))
        if(hasUpgrade("i", 11)) eff = eff.times(tmp.i.upgrades[11].effect)
        if(hasUpgrade("i", 25)) eff = eff.times(tmp.i.upgrades[25].effect)
        if(hasUpgrade("g", 13)) eff = eff.add(1).pow(tmp.g.upgrades[13].effect).minus(1)
        if(hasUpgrade("i", 32)) eff = eff.pow(2500)
        if(hasUpgrade("sh", 11)) eff = eff.pow(tmp.sh.upgrades[11].effect.log10().add(1).log10().add(1))
        if(eff.gte("ee25") && !hasUpgrade("i", 32)) {
            if(hasUpgrade("g", 15)) eff = eff.times(new Decimal("ee25").pow(3)).pow(0.25)
            else eff = eff.times(new Decimal("ee25").pow(999)).pow(0.001)
        } 
        if(!hasUpgrade("i", 34))eff = eff.min("eee101")
        tetr = new Decimal(1.1)
        if(hasUpgrade("p", 35)) tetr = tetr.times(5)
        if(hasUpgrade("i", 44)) tetr = tetr.times(tmp.i.upgrades[44].effect)
        if(hasUpgrade("g", 22)) tetr = tetr.times(tmp.g.upgrades[22].effect)
        if(hasUpgrade("sh", 11)) tetr = tetr.times(tmp.sh.upgrades[11].effect.log10().add(1).log10().add(1))
        if(hasUpgrade("w", 44)) tetr = tetr.times(100)
        if(player.i.layer > 25000000) tetr = tetr.div(new Decimal(player.i.layer/25000000).pow(0.6))
        if(player.i.layer > 100000000) tetr = tetr.div(new Decimal(player.i.layer).log10().pow(0.75))
        tetr = tetr.max(1.1)
        if(hasUpgrade("i", 35)) eff = player.i.points.tetrate(tetr.times(player.i.diff*20))
        if(eff.layer >= player.i.layer_limit) eff = new Decimal(10).tetrate(150000000)
        return eff
	},
	effectDescription() {
        if(tmp.i.effect.gte("eee100") && !hasUpgrade("i", 34)) return "And Your Money Is Adding "+format(tmp.i.effect.times(100))+"% To that Amount Every Second ( Hardcapped )"
        if(tmp.i.effect.gte("ee25") && !hasUpgrade("i", 32)) return "And Your Money Is Adding "+format(tmp.i.effect.times(100))+"% To that Amount Every Second ( Softcapped )"
        return "And Your Money Is Adding "+format(tmp.i.effect.times(100))+"% To that Amount Every Second"
	},
    doReset(resettingLayer){
        let keep = []
        if (layers[resettingLayer].row > this.row) layerDataReset(this.layer, keep)
    },
    upgrades: {
        11: {
            title: "Inflated",
            description: "Inflation boosts inflation gain",
            cost() { return new Decimal("1e10") },
            unlocked() { return player.i.unlocked || hasUpgrade("i", 11) },
            effect() {
                eff = new Decimal(player.i.points.log10().pow(0.05).add(1).min(3))
                if(hasUpgrade("i", 21)) eff = eff.times(tmp.i.upgrades[21].effect)
                if(hasUpgrade("i", 15)) eff = eff.pow(tmp.i.upgrades[15].effect)
				return eff
            },
            effectDisplay() { return "*"+format(tmp.i.upgrades[11].effect) + " to inflation gain" },
        },
        12: {
            title: "Boost",
            description: "Inflation boosts corrupt government gain",
            cost() { return new Decimal("1e50") },
            unlocked() { return player.i.unlocked || hasUpgrade("i", 12) },
            effect() { 
                eff = new Decimal(player.i.points.log10().add(1).log10().pow(15).add(1).min("1e30"))
                if(hasUpgrade("i", 21)) eff = eff.times(tmp.i.upgrades[21].effect)
				return eff
            },
            effectDisplay() { return "*"+format(tmp.i.upgrades[12].effect) + " to corrupt government gain" },
        },
        13: {
            title: "Generation",
            description: "Lose 1% of your corrupt politicians every second, but they boost corrupt government gain",
            cost() { return new Decimal("1e100") },
            unlocked() { return player.i.unlocked || hasUpgrade("i", 13) },
            effect() {
                eff = new Decimal(player.p.points.div(100).add(1).log10().pow(5))
                if(hasUpgrade("i", 21)) eff = eff.times(tmp.i.upgrades[21].effect)
				return eff.max(1)
            },
            effectDisplay() { return "*"+format(tmp.i.upgrades[13].effect) + " to corrupt government gain" },
        },
        14: {
            title: "Inflated Politics",
            description: "Generation also boosts corrupt politician gain",
            cost() { return new Decimal("1e200") },
            unlocked() { return hasUpgrade("g", 13) || hasUpgrade("i", 14) },
            effect() { 
				return tmp.i.upgrades[13].effect
            },
            effectDisplay() { return "*"+format(tmp.i.upgrades[14].effect) + " to corrupt politician gain" },
        },
        15: {
            title: "Inflated+",
            description: "Cube Inflated effect",
            cost() { return new Decimal("1.79e308") },
            unlocked() { return hasUpgrade("g", 13) || hasUpgrade("i", 15) },
            effect() { 
                eff = new Decimal(3)
                if(hasUpgrade("i", 21)) eff = eff.times(tmp.i.upgrades[21].effect)
				return eff
            },
            effectDisplay() { return "^"+format(tmp.i.upgrades[15].effect) + " to Inflated effect" },
        },
        21: {
            title: "Inflated++",
            description: "Boost all upgrades on the row above based on inflation",
            cost() { return new Decimal("1e500") },
            unlocked() { return hasUpgrade("i", 15) || hasUpgrade("i", 21) },
            effect() { 
                eff = new Decimal(player.i.points.slog()).max(1)
                if(hasUpgrade("i", 23)) eff = eff.pow(tmp.i.upgrades[23].effect)
                if(hasUpgrade("i", 24)) eff = eff.pow(tmp.i.upgrades[24].effect)
				return eff
            },
            effectDisplay() { return "*"+format(tmp.i.upgrades[21].effect) + " to all upgrades effects in the row above" },
        },
        22: {
            title: "Pushing A Little Bit Further",
            description: "Raise electricity gain to the 1.001 th power",
            cost() { return new Decimal("1e10000") },
            unlocked() { return player.i.points.gte("1e5000") || hasUpgrade("i", 22) },
        },
        23: {
            title: "Zimbabwe",
            description: "Boost Inflated++ based on money",
            cost() { return new Decimal("1e15000") },
            unlocked() { return player.i.points.gte("1e10000") || hasUpgrade("i", 23) },
            effect() { 
                eff = new Decimal(player.m.points.add(1).log10().pow(1/25)).max(1)
                if(hasUpgrade("i", 24)) eff = eff.pow(tmp.i.upgrades[24].effect)
				return eff
            },
            effectDisplay() { return "^"+format(tmp.i.upgrades[23].effect) + " to Inflated++" },
        },
        24: {
            title: "Germany",
            description: "Boost Inflated++ and Zimbabwe based on money",
            cost() { return new Decimal("1e25000") },
            unlocked() { return player.i.points.gte("1e20000") || hasUpgrade("i", 24) },
            effect() { 
                eff = new Decimal(player.m.points.add(1).log10().pow(1/50)).max(1)
				return eff
            },
            effectDisplay() { return "^"+format(tmp.i.upgrades[24].effect) + " to Inflated++ and Zimbabwe" },
        },
        25: {
            title: "Hyperinflation",
            description: "Inflation boosts infation again",
            cost() { return new Decimal("1e5000000") },
            unlocked() { return player.i.points.gte("1e100000") || hasUpgrade("i", 25) },
            effect() { 
                if(hasUpgrade("i", 33)) eff = new Decimal(10).pow(player.i.points.log10().pow(1.5))
                else eff = new Decimal(10).pow(player.i.points.log10().pow(0.95))
				return eff
            },
            effectDisplay() { return "*"+format(tmp.i.upgrades[25].effect) + " to inflation gain" },
        },
        31: {
            title: "Hyperinflated Boost",
            description: "Inflation boosts corrupt governments again",
            cost() { return new Decimal("ee27") },
            unlocked() { return player.i.points.gte("ee25") || hasUpgrade("i", 31) },
            effect() { 
                eff = new Decimal(player.i.points.log10().add(1).log10().add(1).pow(30).min("e100"))
				return eff
            },
            effectDisplay() { return "*"+format(tmp.i.upgrades[31].effect) + " to corrupt government gain" },
        },
        32: {
            title: "Annilihate The Softcaps",
            description: "Remove the useless softcap on inflation gain and raise inflation gain to the 2500th power",
            cost() { return new Decimal("ee30") },
            unlocked() { return player.i.points.gte("ee28") || hasUpgrade("i", 32) },
        },
        33: {
            title: "I n f l a t e",
            description: "Make the Hyperinflation formula better and enter the i n f l a t e d era",
            cost() { return new Decimal("ee100") },
            unlocked() { return player.i.points.gte("ee75") || hasUpgrade("i", 33) },
        },
        34: {
            title: "Why ?",
            description: "Why must inflation stop ?",
            cost() { return new Decimal("eee100") },
            unlocked() { return player.i.points.gte("eee100") || hasUpgrade("i", 34) },
        },
        35: {
            title: "F",
            description: "Inflation go brrr",
            cost() { return new Decimal("eee250") },
            unlocked() { return player.i.points.gte("eee110") || hasUpgrade("i", 35) },
        },
        41: {
            title: "Finally, A Boost",
            description: "Inflation boosts electricity gain",
            cost() { return new Decimal("10").tetrate(2000) },
            unlocked() { return player.i.layer > 500 || hasUpgrade("i", 41) },
            effect() { 
                eff = new Decimal(player.i.points.layer).add(1).pow(0.1)
                if(eff.gte(1.5)) eff = new Decimal(1.5)
				return eff
            },
            effectDisplay() { return "^"+format(tmp.i.upgrades[41].effect) + " to electricity gain" },
        },
        42: {
            title: "Another Boost ?",
            description() {return (hasUpgrade("p", 45) ? "Inflation boosts":"Boost") + " corrupt politician and corrupt government gain"},
            cost() { return new Decimal("10").tetrate(3000) },
            unlocked() { return player.i.layer > 2200 || hasUpgrade("i", 42) },
            effect() {
                eff = new Decimal(2).pow(0.5)
                if(hasUpgrade("p", 45)) eff = new Decimal(player.i.layer).pow(0.025).max(eff)
                if(eff.gte(1.75)) eff = new Decimal(1.75)
				return eff
            },
            effectDisplay() { return "^"+format(tmp.i.upgrades[42].effect) + " to corrupt politician and corrupt governement gain" },
        },
        43: {
            title: "Upgrade Stuff Before The Next Layer",
            description: "Generation doesn't remove corrupt politicians anymore and unlock 3 corrupt politician upgrades and 3 corrupt government upgrades",
            cost() { return new Decimal("10").tetrate(5000) },
            unlocked() { return player.i.layer > 3500 || hasUpgrade("i", 43) },
        },
        44: {
            title: "Another Self-Boost I Guess",
            description: "Inflation boosts its generation speed",
            cost() { return new Decimal("10").tetrate(25000) },
            unlocked() { return player.i.layer > 15000 || hasUpgrade("i", 44) },
            effect() { 
                eff = new Decimal(player.i.layer).add(1).log10().add(1)
				return eff
            },
            effectDisplay() { return "*"+format(tmp.i.upgrades[44].effect) + " to inflation gain speed" },
        },
        45: {
            title: "Battery Powering",
            description: "Inflation boosts battery amount in the battery effect formula",
            cost() { return new Decimal("10").tetrate(1500000) },
            unlocked() { return player.i.layer > 500000 || hasUpgrade("i", 45) },
            effect() { 
                eff = new Decimal(player.i.layer).add(1).pow(1/30).min(2)
				return eff
            },
            effectDisplay() { return "^"+format(tmp.i.upgrades[45].effect) + " to battery amount in the effect formula" },
        },
    },
    update(diff) {
        if(player.i.unlocked) {
            if(hasUpgrade("i", 33)) {
			    player.i.points.layer = tmp.i.effect.layer
    			player.i.points.mag = tmp.i.effect.mag
	    		player.i.layer = ((tmp.i.effect.layer > player.i.points.layer ? tmp.i.effect.layer:player.i.points.layer) > player.i.layer ? (tmp.i.effect.layer > player.i.points.layer ? tmp.i.effect.layer:player.i.points.layer):player.i.layer)
		    	if(player.i.layer > player.i.points.layer || player.i.points.layer == NaN) player.i.points.layer = player.i.layer
			    if(player.i.mag > player.i.points.mag || player.i.points.mag == NaN) player.i.points.mag = player.i.mag
		    }
    		else addPoints("i", player.i.points.times(tmp.i.effect.add(1).pow(diff).minus(1)))
	    	if(inChallenge("sh", 11)) player.i.points = new Decimal(1)
	        if(hasUpgrade("i", 13) && !hasUpgrade("i", 43) && player.i.unlocked) player.p.points = player.p.points.times(new Decimal(0.99).pow(diff))
        }
    },
})
addLayer("bm", {
    tabFormat: {
        "Main":{
            content: [
                "clickables"
            ],
        },
    },
    symbol: "BM", // This appears on the layer's node. Default is the id with the first letter capitalized
    row: "side", // Row the layer is in on the tree (0 is the first row)
    position: -1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    color: "#3836b6",
    layerShown(){return player.bm.unlocked},
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
    }},
    baseAmount() {return player.points}, // Get the current amount of baseResource
    clickables: {
        11: {
            display: "Buy All Money Upgrades",
            unlocked() {return true},
            canClick() {return true},
            onClick() {buyAll("m")},
        },
        12: {
            display: "Bulk Buy All Money Buyables",
            unlocked() {return true},
            canClick() {return true},
            onClick() {buyAllBuyables("m")},
        },
        21: {
            display: "Buy All Battery Upgrades",
            unlocked() {return true},
            canClick() {return true},
            onClick() {buyAll("b")},
        },
        22: {
            display: "Bulk Buy All Battery Buyables",
            unlocked() {return true},
            canClick() {return true},
            onClick() {buyAllBuyables("b")},
        },
        31: {
            display: "Buy All Workers Upgrades",
            unlocked() {return true},
            canClick() {return true},
            onClick() {buyAll("w")},
        },
        41: {
            display: "Buy All Coal Upgrades",
            unlocked() {return true},
            canClick() {return true},
            onClick() {buyAll("c")},
        },
        51: {
            display: "Buy All Nuclear Upgrades",
            unlocked() {return true},
            canClick() {return true},
            onClick() {buyAll("n")},
        },
        52: {
            display: "Bulk Buy All Nuclear Buyables",
            unlocked() {return true},
            canClick() {return true},
            onClick() {buyAllBuyables("n")},
        },
        61: {
            display: "Buy All Solar Upgrades",
            unlocked() {return true},
            canClick() {return true},
            onClick() {buyAll("s")},
        },
        62: {
            display: "Bulk Buy All Solar Buyables",
            unlocked() {return true},
            canClick() {return true},
            onClick() {buyAllBuyables("s")},
        },
        71: {
            display: "Buy All Politicians Upgrades",
            unlocked() {return true},
            canClick() {return true},
            onClick() {buyAll("p")},
        },
        81: {
            display: "Buy All Governments Upgrades",
            unlocked() {return true},
            canClick() {return true},
            onClick() {buyAll("g")},
        },
        91: {
            display: "Buy All Inflation Upgrades",
            unlocked() {return true},
            canClick() {return true},
            onClick() {buyAll("i")},
        },
    },
})
