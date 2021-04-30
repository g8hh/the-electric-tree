addLayer("m", {
    name: "money", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "M", // This appears on the layer's node. Default is the id with the first letter capitalized
    row: 0, // Row the layer is in on the tree (0 is the first row)
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    color: "#426432",
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
        rows: 10,
        cols: 5,
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
                return new Decimal(player.m.points.pow(100))
            },
            effectDisplay() {return "/" + format(tmp.m.upgrades[53].effect) + " to battery cost"},
        },
        54: {
            title: "Take It Easy",
            description: "Another easy boost to recover. Nuclear power plant cost is divided by workers",
            cost() { return new Decimal("1e680000") },
            unlocked() { return hasChallenge("n", 12) || hasUpgrade("m", 54) },
            effect() {
                return new Decimal(player.w.points.pow(10))
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
    },
    buyables: {
        rows: 1,
        cols: 3,
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
                if(inChallenge("n", 12)) {
                    return new Decimal(1)
                }
                return new Decimal("1e10").pow(getBuyableAmount("m", 11)) 
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
    },
})
addLayer("b", {
    name: "batteries", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "B", // This appears on the layer's node. Default is the id with the first letter capitalized
    row: 1, // Row the layer is in on the tree (0 is the first row)
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    color: "#d838996",
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
        if(player.b.points.gte(20)) {exp = exp.add(0.05)}
        if(player.b.points.gte(35)) {exp = exp.add(0.05)}
        if(player.b.points.gte(50)) {exp = exp.add(0.05)}
        if(player.b.points.gte(65)) {exp = exp.add(0.1)}
        if(player.b.points.gte(75)) {exp = exp.add(0.1)}
        if(player.b.points.gte(85)) {exp = exp.add(0.15)}
        if(player.b.points.gte(100)) {exp = exp.add(0.1)}
        if(player.b.points.gte(150)) {exp = exp.add(0.15)}
        if(player.b.points.gte(200)) {exp = exp.add(0.5)}
        if(player.b.points.gte(220)) {exp = exp.add(0.5)}
        if(player.b.points.gte(250)) {exp = exp.add(0.5)}
        if(player.b.points.gte(300)) {exp = exp.add(0.25)}
        if(player.b.points.gte(320)) {exp = exp.add(0.05)}
        if(player.b.points.gte(365)) {exp = exp.add(0.05)}
        if(player.b.points.gte(399)) {exp = exp.add(0.0147)}
        if(player.b.points.gte(400)) {exp = exp.add(0.6353)}
        if(player.b.points.gte(425)) {exp = exp.add(0.5)}
        if(player.b.points.gte(450)) {exp = exp.add(0.5)}
        if(player.b.points.gte(470)) {exp = exp.add(0.75)}
        if(player.b.points.gte(500)) {exp = exp.add(0.75)}
        if(player.b.points.gte(600)) {exp = exp.add(0.25)}
        if(player.b.points.gte(700)) {exp = exp.add(0.25)}
        if(player.b.points.gte(800)) {exp = exp.add(0.25)}
        if(player.b.points.gte(900)) {exp = exp.add(0.25)}
        if(player.b.points.gte(1000)) {exp = exp.add(0.5)}
        if(player.b.points.gte(2000)) {exp = exp.add(1.5)}
        if(player.b.points.gte(2500)) {exp = exp.add(1.5)}
        if(player.b.points.gte(2800)) {exp = exp.add(0.5)}
        if(player.b.points.gte(3000)) {exp = exp.add(1)}
        if(player.b.points.gte(4000)) {exp = exp.add(1)}
        if(player.b.points.gte(5000)) {exp = exp.add(2.5)}
        if(player.b.points.gte(6000)) {exp = exp.add(1)}
        if(player.b.points.gte(7000)) {exp = exp.add(1)}
        if(player.b.points.gte(8000)) {exp = exp.add(1)}
        if(player.b.points.gte(9000)) {exp = exp.add(1)}
        if(player.b.points.gte(10000)) {exp = exp.add(5)}
        if(hasUpgrade("c", 13)) {exp = exp.minus(1)}
        if(hasUpgrade("n", 13)) {exp = exp.minus(tmp.n.upgrades[13].effect)}
        exp = exp.minus(tmp.b.buyables[11].effect)
        if(inChallenge("n", 11)) exp = exp.add(new Decimal(0.01).times(player.b.upgrades.length))
        if(inChallenge("s", 12)) {
            if(getBuyableAmount("p", 22).eq(1)) exp = exp.add(0.025)
        }
        if(inChallenge("s", 21)) {
            exp = exp.add(getBuyableAmount("p", 11).times(0.5))
        }
        return exp
    },
	base() {
        base = new Decimal(10)
        base = base.minus(tmp.b.buyables[13].effect)
        if(inChallenge("s", 12)) {
            if(getBuyableAmount("p", 12).eq(1)) base = base.minus(2.5)
        }
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
        if (layers[resettingLayer].row > this.row) layerDataReset(this.layer, keep)
    },
    upgrades: {
        rows: 5,
        cols: 5,
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
    },
    buyables: {
        rows: 1,
        cols: 3,
        11: {
            title: "Exponent Crusher",
            display() {
                if(hasUpgrade("m", 62)) {
                    return "Reduces battery cost exponent by " + format(tmp.b.buyables[11].effect) + "<br>Cost : " + format(new Decimal(5).add(getBuyableAmount("b", 11).pow(0.5)).times(getBuyableAmount("b", 11).add(1).pow(0.75)).floor()) + " batteries"
                }
                return "Reduces battery cost exponent by " + format(tmp.b.buyables[11].effect) + "<br>Cost : " + format(new Decimal(5).add(getBuyableAmount("b", 11).pow(0.5)).times(getBuyableAmount("b", 11).add(1)).floor()) + " batteries"
            },
            unlocked() { return hasUpgrade("w", 33) },
            canAfford() { 
                if(hasUpgrade("m", 62)) {
                    return player.b.points.gte(new Decimal(5).add(getBuyableAmount("b", 11).pow(0.5)).times(getBuyableAmount("b", 11).add(1).pow(0.75)).floor())
                }
                return player.b.points.gte(new Decimal(5).add(getBuyableAmount("b", 11).pow(0.5)).times(getBuyableAmount("b", 11).add(1)).floor())
            },
            buy() {
                if(!hasMilestone("b", 2)) {
                    if(hasUpgrade("m", 62)) {
                        player.b.points = player.b.points.minus(new Decimal(5).add(getBuyableAmount("b", 11).pow(0.5)).times(getBuyableAmount("b", 11).add(1).pow(0.75)).floor())
                    }
                    else {
                        player.b.points = player.b.points.minus(new Decimal(5).add(getBuyableAmount("b", 11).pow(0.5)).times(getBuyableAmount("b", 11).add(1)).floor())
                    }
                }
                setBuyableAmount("b", 11, getBuyableAmount("b", 11).add(1))
            },
            effect() {
                eff = new Decimal(0.01).times(getBuyableAmount("b", 11).add(tmp.b.buyables[13].effect.add(1).pow(5)))
                if(hasUpgrade("w", 34)) {eff = eff.times(1.1)}
                if(eff.gte(5)) eff = eff.minus(4).pow(0.8).add(4)
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
                eff = new Decimal(1).add(getBuyableAmount("b", 12).pow(5))
                if(inChallenge("n", 12)) {
                    eff = new Decimal(1)
                }
                return eff
            }
        },
        13: {
            title: "Base Smasher",
            display() { return "Reduces battery base by " + format(tmp.b.buyables[13].effect) + " and add " + format(tmp.b.buyables[13].effect.add(1).pow(5)) + " free levels to Exponent Crusher<br>Cost : " + format(new Decimal(2000).add(getBuyableAmount("b", 13).pow(1.5).times(100)).floor()) + " batteries" },
            unlocked() { return hasUpgrade("p", 33) },
            canAfford() { 
                return player.b.points.gte(new Decimal(2000).add(getBuyableAmount("b", 13).pow(1.5).times(100)).floor())
            },
            buy() {
                if(!hasMilestone("b", 2)) {
                    player.b.points = player.b.points.minus(new Decimal(2000).add(getBuyableAmount("b", 13).pow(1.5).times(100)).floor())
                }
                setBuyableAmount("b", 13, getBuyableAmount("b", 13).add(1))
            },
            effect() {
                eff = getBuyableAmount("b", 13).times(8).div(getBuyableAmount("b", 13).add(25))
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
    name: "worker", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "W", // This appears on the layer's node. Default is the id with the first letter capitalized
    row: 1, // Row the layer is in on the tree (0 is the first row)
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    color: "#ff2222",
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
		if(hasUpgrade("b", 24)) {mult = mult.times(tmp.b.upgrades[24].effect)}
        if(hasUpgrade("b", 32)) {mult = mult.times(tmp.b.upgrades[32].effect)}
        if(hasUpgrade("b", 43)) {mult = mult.times(tmp.b.upgrades[43].effect)}
        if(hasUpgrade("w", 21)) {mult = mult.times(tmp.w.upgrades[21].effect)}
        if(hasUpgrade("c", 11)) {mult = mult.times(tmp.c.upgrades[11].effect)}
        if(hasUpgrade("c", 12)) {mult = mult.times(tmp.c.effect)}
        if(hasUpgrade("n", 11)) {mult = mult.times(tmp.n.upgrades[11].effect)}
        if(hasUpgrade("n", 14)) {mult = mult.times(tmp.n.upgrades[14].effect)}
        if(hasUpgrade("s", 12)) {mult = mult.times(tmp.s.upgrades[12].effect)}
        if(hasUpgrade("sh", 12)) {mult = mult.times(tmp.sh.effect)}
        if(inChallenge("n", 11)) {
            mult = mult.div(new Decimal(100).pow(player.w.upgrades.length))
        }
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
        if (layers[resettingLayer].row > this.row) layerDataReset(this.layer, keep)
    },
    upgrades: {
        rows: 5,
        cols: 5,
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
                return new Decimal(player.m.points.add(1).log10().pow(1/3))
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
    },
    challenges: {
		rows:2,
		cols:2,
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
    name: "coal power plants", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "C", // This appears on the layer's node. Default is the id with the first letter capitalized
    row: 2, // Row the layer is in on the tree (0 is the first row)
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    color: "#666666",
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
        if(player.c.points.gte(10)) {exp = exp.add(0.25)}
        if(player.c.points.gte(15)) {exp = exp.add(0.25)}
        if(player.c.points.gte(20)) {exp = exp.add(0.25)}
        if(player.c.points.gte(25)) {exp = exp.add(0.5)}
        if(player.c.points.gte(30)) {exp = exp.add(0.5)}
        if(player.c.points.gte(35)) {exp = exp.add(0.75)}
        if(player.c.points.gte(60)) {exp = exp.add(0.75)}
        if(player.c.points.gte(70)) {exp = exp.add(0.75)}
        if(player.c.points.gte(85)) {exp = exp.add(1)}
        if(player.c.points.gte(100)) {exp = exp.add(2.5)}
        if(inChallenge("n", 11)) {
            exp = exp.add(new Decimal(0.05).times(player.c.upgrades.length))
        }
        if(hasUpgrade("p", 11)) {exp = exp.minus(tmp.p.upgrades[11].effect)}
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
    doReset(resettingLayer){
        let keep = []
        if (layers[resettingLayer].row > this.row) layerDataReset(this.layer, keep)
    },
    upgrades: {
        rows: 5,
        cols: 5,
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
    name: "nuclear power plants", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "N", // This appears on the layer's node. Default is the id with the first letter capitalized
    row: 2, // Row the layer is in on the tree (0 is the first row)
    position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    color: "#2cfa1f",
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
        if(player.n.points.gte(5)) {exp = exp.add(0.5)}
        if(player.n.points.gte(10)) {exp = exp.add(0.5)}
        if(player.n.points.gte(11)) {exp = exp.add(2.5)}
        if(player.n.points.gte(15)) {exp = exp.add(0.75)}
        if(player.n.points.gte(20)) {exp = exp.add(0.75)}
        if(player.n.points.gte(25)) {exp = exp.add(0.75)}
        if(player.n.points.gte(30)) {exp = exp.add(0.75)}
        if(player.n.points.gte(40)) {exp = exp.add(1)}
        if(player.n.points.gte(50)) {exp = exp.add(1.5)}
        if(hasUpgrade("p", 12)) {exp = exp.minus(tmp.p.upgrades[12].effect)}
        if(hasUpgrade("p", 15)) {exp = exp.minus(1)}
        if(hasUpgrade("n", 15)) {exp = exp.minus(1)}
        return exp
    },
	base() {return new Decimal(125)},
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
    doReset(resettingLayer){
        let keep = []
        if(hasMilestone("sh", 0)) keep.push("challenges")
        if (layers[resettingLayer].row > this.row) layerDataReset(this.layer, keep)
    },
    upgrades: {
        rows: 5,
        cols: 5,
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
    },
    buyables: {
        rows: 2,
        cols: 3,
        11: {
            title: "Nuclear Weapon",
            display() {
                return "Boosts corrupt politician gain by " + format(tmp.n.buyables[11].effect) + "x<br>Cost : " + format(new Decimal(5).add(getBuyableAmount("n", 11).pow(1.25)).minus(getBuyableAmount("n", 11)).floor()) + " nuclear power plants"
            },
            unlocked() { return hasUpgrade("m", 61) },
            canAfford() { 
                return player.n.points.gte(new Decimal(5).add(getBuyableAmount("n", 11).pow(1.25)).minus(getBuyableAmount("n", 11)).floor()) 
            },
            buy() { 
                player.n.points = player.n.points.minus(new Decimal(5).add(getBuyableAmount("n", 11).pow(1.25)).minus(getBuyableAmount("n", 11)).floor())
                setBuyableAmount("n", 11, getBuyableAmount("n", 11).add(1))
            },
            effect() { 
                eff = new Decimal(1.1)
                if(hasUpgrade("n", 21)) {
                    eff = eff.add(0.02)
                    eff = eff.add(tmp.n.buyables[12].effect)
                }
                return eff.pow(getBuyableAmount("n", 11)) 
            }
        },
        12: {
            title: "Plutonium-239",
            display() {
                return "Adds " + format(tmp.n.buyables[12].effect) + " to Nuclear Weapon's base<br>Cost : " + format(new Decimal(10).add(getBuyableAmount("n", 12).pow(1.5)).minus(getBuyableAmount("n", 12)).floor()) + " nuclear power plants"
            },
            unlocked() { return hasUpgrade("n", 21) },
            canAfford() { 
                return player.n.points.gte(new Decimal(10).add(getBuyableAmount("n", 12).pow(1.5)).minus(getBuyableAmount("n", 12)).floor()) 
            },
            buy() { 
                player.n.points = player.n.points.minus(new Decimal(10).add(getBuyableAmount("n", 12).pow(1.5)).minus(getBuyableAmount("n", 12)).floor())
                setBuyableAmount("n", 12, getBuyableAmount("n", 12).add(1))
            },
            effect() { 
                return new Decimal(getBuyableAmount("n", 12)).pow(0.75).times(0.01).times(tmp.n.buyables[13].effect) 
            }
        },
        13: {
            title: "Curium-243",
            display() {
                return "Multiply Plutonium-239's effect by " + format(tmp.n.buyables[13].effect) + " <br>Cost : " + format(new Decimal(10).add(getBuyableAmount("n", 13).pow(1.75)).minus(getBuyableAmount("n", 13)).floor()) + " nuclear power plants"
            },
            unlocked() { return hasUpgrade("s", 14) },
            canAfford() { 
                return player.n.points.gte(new Decimal(10).add(getBuyableAmount("n", 13).pow(1.75)).minus(getBuyableAmount("n", 13)).floor()) 
            },
            buy() { 
                player.n.points = player.n.points.minus(new Decimal(10).add(getBuyableAmount("n", 13).pow(1.75)).minus(getBuyableAmount("n", 13)).floor())
                setBuyableAmount("n", 13, getBuyableAmount("n", 13).add(1))
            },
            effect() { 
                return new Decimal(getBuyableAmount("n", 13)).times(0.1).add(1).pow(tmp.n.buyables[21].effect) 
            }
        },
        21: {
            title: "Berkelium-243",
            display() {
                return "Raises Curium-243's effect to the " + format(tmp.n.buyables[21].effect) + " th power<br>Cost : " + format(new Decimal(10).add(getBuyableAmount("n", 21).pow(2.5)).minus(getBuyableAmount("n", 21)).floor()) + " nuclear power plants"
            },
            unlocked() { return hasUpgrade("s", 14) },
            canAfford() { 
                return player.n.points.gte(new Decimal(10).add(getBuyableAmount("n", 21).pow(2.5)).minus(getBuyableAmount("n", 21)).floor()) 
            },
            buy() { 
                player.n.points = player.n.points.minus(new Decimal(10).add(getBuyableAmount("n", 21).pow(2.5)).minus(getBuyableAmount("n", 21)).floor())
                setBuyableAmount("n", 21, getBuyableAmount("n", 21).add(1))
            },
            effect() { 
                return new Decimal(getBuyableAmount("n", 21)).times(0.25).add(1) 
            }
        },
    },
    challenges: {
		rows:2,
		cols:2,
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
    name: "solar power plants", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "S", // This appears on the layer's node. Default is the id with the first letter capitalized
    row: 2, // Row the layer is in on the tree (0 is the first row)
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    color: "#ffff00",
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
	base() {return new Decimal(1.1)},
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if(hasUpgrade("s", 11)) {mult = mult.div(1.5)}
        if(hasUpgrade("g", 11)) {mult = mult.div(tmp.g.upgrades[11].effect)}
        if(hasUpgrade("n", 22)) {mult = mult.div(5)}
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
		eff = eff.pow(player.s.points.times(new Decimal(60).div(player.s.points.max(60))).pow(5))
        if(hasUpgrade("s", 13)) {eff = eff.pow(2)}
		return eff
	},
	effectDescription() {
        return "Which Are Boosting Electricity Gain By "+format(tmp.s.effect)+"x And Divide Battery Cost By "+format(tmp.s.effect.pow(1000))+"x"
	},
	resetsNothing() { return hasMilestone("s", 0) },
    doReset(resettingLayer){
        let keep = []
        if(hasMilestone("sh", 0)) keep.push("challenges")
        if (layers[resettingLayer].row > this.row) layerDataReset(this.layer, keep)
    },
    upgrades: {
        rows: 5,
        cols: 5,
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
        rows: 1,
        cols: 3,
        11: {
            title: "Too Much Light",
            display() {
                return "Unlock an upgrade<br>Cost : " + format(new Decimal(15).add(getBuyableAmount("s", 11).pow(2)).minus(getBuyableAmount("s", 11).pow(1.5)).floor()) + " solar power plants"
            },
            unlocked() { return player.s.unlocked },
            canAfford() { 
                return player.s.points.gte(new Decimal(15).add(getBuyableAmount("s", 11).pow(2)).minus(getBuyableAmount("s", 11).pow(1.5)).floor()) 
            },
            buy() { 
                player.s.points = player.s.points.minus(new Decimal(15).add(getBuyableAmount("s", 11).pow(2)).minus(getBuyableAmount("s", 11).pow(1.5)).floor())
                setBuyableAmount("s", 11, getBuyableAmount("s", 11).add(1))
            },
        },
    },
    challenges: {
		rows:2,
		cols:2,
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
			challengeDescription() {return "The row 3 effects and side layers effects don't work anymore, and choose between 3 buffs and nerfs in the corrupt politician layer<br>Don't enter the challenge if 3rd nuclear challenge reward is not capped at e50000 or if you have less than 22 nuclear power plants<br>Challenge completions : "+challengeCompletions("s", 12)+"/9"},
			goalDescription() {
                if(challengeCompletions("s", 12) == 0) return "e255294 KWh/s"
                if(challengeCompletions("s", 12) == 1) return "e253762 KWh/s with another combinaison than 1-2"
                if(challengeCompletions("s", 12) == 2) return "e253546 KWh/s with another combinaison than 1-1 or 1-2"
                if(challengeCompletions("s", 12) == 3) return "e203503 KWh/s with another combinaison than 1-1 or 1-2 or 1-3"
                if(challengeCompletions("s", 12) == 4) return "e203181 KWh/s with another combinaison than 1-1 or 1-2 or 1-3 or 3-2"
                if(challengeCompletions("s", 12) == 5) return "e202062 KWh/s with another combinaison than 1-1 or 1-2 or 1-3 or 2-2 or 3-2"
                if(challengeCompletions("s", 12) == 6) return "e202061 KWh/s with another combinaison than 1-1 or 1-2 or 1-3 or 2-2 or 2-3 or 3-2"
                if(challengeCompletions("s", 12) == 7) return "e87258 KWh/s with another combinaison than 1-1 or 1-2 or 1-3 or 2-2 or 2-3 or 3-2 or 3-3"
                if(challengeCompletions("s", 12) == 8) return "e87252 KWh/s with another combinaison than 1-1 or 1-2 or 1-3 or 2-2 or 2-3 or 3-1 or 3-2 or 3-3"
                if(challengeCompletions("s", 12) == 9) return "F1.79e308 KWh/s"
            },
			rewardDescription() {
                if(challengeCompletions("s", 12) == 9) return "Raise electricity gain to the 1.05 th power"
                return "You need "+(9-challengeCompletions("s", 12))+" more completions to unlock the reward"
            },
			unlocked() { return hasUpgrade("c", 24) || inChallenge("s", 12) || hasChallenge("s", 12) },
            completionLimit: 9,
			canComplete() { 
                if(challengeCompletions("s", 12) == 0) return getPointGen().gte("e255294") && getBuyableAmount("p", 11).add(getBuyableAmount("p", 22)).eq(2)
                if(challengeCompletions("s", 12) == 1) return getPointGen().gte("e253762") && getBuyableAmount("p", 11).add(getBuyableAmount("p", 21)).eq(2)
                if(challengeCompletions("s", 12) == 2) return getPointGen().gte("e253546") && getBuyableAmount("p", 11).add(getBuyableAmount("p", 23)).eq(2)
                if(challengeCompletions("s", 12) == 3) return getPointGen().gte("e203503") && getBuyableAmount("p", 13).add(getBuyableAmount("p", 22)).eq(2)
                if(challengeCompletions("s", 12) == 4) return getPointGen().gte("e203181") && getBuyableAmount("p", 12).add(getBuyableAmount("p", 22)).eq(2)
                if(challengeCompletions("s", 12) == 5) return getPointGen().gte("e202062") && getBuyableAmount("p", 12).add(getBuyableAmount("p", 23)).eq(2)
                if(challengeCompletions("s", 12) == 6) return getPointGen().gte("e202061") && getBuyableAmount("p", 13).add(getBuyableAmount("p", 23)).eq(2)
                if(challengeCompletions("s", 12) == 7) return getPointGen().gte("e87258") && getBuyableAmount("p", 13).add(getBuyableAmount("p", 21)).eq(2)
                if(challengeCompletions("s", 12) == 8) return getPointGen().gte("e87252") && getBuyableAmount("p", 12).add(getBuyableAmount("p", 21)).eq(2)
                if(challengeCompletions("s", 12) == 9) return getPointGen().gte(new Decimal(10).tetrate("1.79e308")) 
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
    name: "shares", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "SH", // This appears on the layer's node. Default is the id with the first letter capitalized
    row: 3, // Row the layer is in on the tree (0 is the first row)
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    color: "#522915",
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
        return exp
    },
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if(hasUpgrade("sh", 13)) mult = mult.times(tmp.sh.upgrades[13].effect)
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
    passiveGeneration() { return hasMilestone("sh", 2) },
    doReset(resettingLayer){
        let keep = []
        if (layers[resettingLayer].row > this.row) layerDataReset(this.layer, keep)
    },
    upgrades: {
        rows: 5,
        cols: 5,
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
            unlocked() { return hasUpgrade("sh", 11) && player.sh.points.gte(1) || hasUpgrade("sh", 12) },
        },
        13:{
            title: "Inflated Shares",
            description: "Inflation boosts share gain",
            cost() { return new Decimal(2) },
            unlocked() { return hasUpgrade("sh", 11) && player.sh.points.gte(2) || hasUpgrade("sh", 13) },
            effect() {
                eff = new Decimal(player.i.layer).add(1).log10().add(1)
                return eff
            },
            effectDisplay() { return "*" + format(tmp.sh.upgrades[13].effect) + " to share gain"}
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
			effectDescription: "Keep all row 3 milestones",
		},
        2: {
			requirementDescription: "1e15 Shares",
			done() { return player.sh.best.gte("1e15") },
			effectDescription: "Gain 100% of shares on reset every second",
		},
	},
})
addLayer("p", {
    tabFormat: [
        "main-display",
        "milestones",
        "buyables",
        "upgrades",
    ],
    name: "corrupt politicians", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "P", // This appears on the layer's node. Default is the id with the first letter capitalized
    row: "side", // Row the layer is in on the tree (0 is the first row)
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    color: "#0000ff",
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
		exp = new Decimal(1).div(1000000000)
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
        if(hasUpgrade("p", 22)) {eff = eff.pow(1.25)}
        if(hasUpgrade("p", 25)) {eff = eff.pow(2)}
        if(hasUpgrade("p", 41)) {eff = eff.pow(3)}
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
        if(eff.gte(5)) {
            eff = eff.log10().minus(new Decimal(5).log10()).add(1).pow(0.25).add(4)
        }
        if(eff.gte(8)) {
            eff = eff.minus(8).pow(2/3).add(1).pow(0.25).add(7)
        }
        if(eff.gte(10)) {
            eff = eff.log10().minus(new Decimal(10).log10()).add(1).pow(0.1).add(9)
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
        rows: 5,
        cols: 5,
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
                return eff
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
    },
    buyables: {
        rows: 2,
        cols: 3,
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
    tabFormat: [
        "main-display",
        "milestones",
        "upgrades",
    ],
    name: "corrupt governments", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "G", // This appears on the layer's node. Default is the id with the first letter capitalized
    row: "side", // Row the layer is in on the tree (0 is the first row)
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    color: "#0000ff",
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
		exp = new Decimal(1).div(new Decimal("1e1000000000"))
		return exp
	},
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if(hasUpgrade("c", 24)) mult = mult.times(tmp.c.upgrades[24].effect)
        if(hasUpgrade("i", 12)) mult = mult.times(tmp.i.upgrades[12].effect)
        if(hasUpgrade("i", 13)) mult = mult.times(tmp.i.upgrades[13].effect)
        if(hasUpgrade("i", 31)) mult = mult.times(tmp.i.upgrades[31].effect)
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
        eff = eff.times(player.g.points.add(1).log10().add(1).pow(5))
        if(hasUpgrade("g", 21)) eff = eff.pow(10)
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
        rows: 5,
        cols: 5,
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
    },
})
addLayer("i", {
    tabFormat: [
        "main-display",
        "milestones",
        "upgrades",
    ],
    name: "inflation", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "I", // This appears on the layer's node. Default is the id with the first letter capitalized
    row: "side", // Row the layer is in on the tree (0 is the first row)
    position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    color: "#0000ff",
    layerShown(){return hasUpgrade("s", 15) || player.i.unlocked},
    startData() { return {
        unlocked: false,
        points: new Decimal(1),
        layer: 0,
        mag: 1,
        diif: 0,
        first: 0,
        auto: false,
        pseudoUpgs: [],
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
        tetr = new Decimal(1)
        if(hasUpgrade("i", 35)) tetr = new Decimal(1.1)
        if(hasUpgrade("p", 35)) tetr = tetr.times(5)
        if(hasUpgrade("i", 44)) tetr = tetr.times(tmp.i.upgrades[44].effect)
        if(hasUpgrade("g", 22)) tetr = tetr.times(tmp.g.upgrades[22].effect)
        if(hasUpgrade("sh", 11)) tetr = tetr.times(tmp.sh.upgrades[11].effect.log10().add(1).log10().add(1))
        if(hasUpgrade("i", 35)) eff = player.i.points.tetrate(tetr.times(player.i.diff*20))
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
        rows: 5,
        cols: 5,
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
				return eff
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
                eff = new Decimal(player.i.points.slog()).min(1)
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
                eff = new Decimal(player.m.points.add(1).log10().pow(1/25)).min(1)
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
                eff = new Decimal(player.m.points.add(1).log10().pow(1/50)).min(1)
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
            description: "Inflation boosts corrupt politician and corrupt government gain",
            cost() { return new Decimal("10").tetrate(3000) },
            unlocked() { return player.i.layer > 2200 || hasUpgrade("i", 42) },
            effect() { 
                eff = new Decimal(player.i.points.layer).add(1).pow(0.25)
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
            description: "Inflation boosts it's generation speed",
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
})
addLayer("bm", {
    tabFormat: [
        "clickables",
    ],
    symbol: "BM", // This appears on the layer's node. Default is the id with the first letter capitalized
    row: "side", // Row the layer is in on the tree (0 is the first row)
    position: -1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    color: "#0000ff",
    layerShown(){return player.bm.unlocked},
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
    }},
    baseAmount() {return player.points}, // Get the current amount of baseResource
    clickables: {
        rows: 9,
        cols: 2,
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
