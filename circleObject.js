/**
 *
 * by littlefean
 */
class CircleObject {
    /**
     *
     * @param pos {Vector}
     * @param world {World}
     */
    constructor(pos, world) {
        this.pos = pos;
        this.world = world;
        this.gameType = "CircleObject";
        this.r = 20;  // 默认20

        this.speed = new Vector(0, 0);
        this.acceleration = new Vector(0, 0);
        this.accelerationV = 0;  // 方向始终和速度方向一致的加速度 这个加速度的优先级比自定义的高

        this.hp = 100;
        this.maxHp = 100;

        this.hpColor = [122, 12, 12, 1];
        this.bodyColor = [20, 20, 20, 1];
        this.bodyStrokeWidth = 5;
        this.bodyStrokeColor = [0, 0, 0, 0];
        this.hpBarHeight = 10;
    }

    /**
     * 初始化实体设定血量上限，并填充为满血
     * @param n
     */
    hpInit(n) {
        this.hp = n;
        this.maxHp = n;
    }

    /**
     * 改变怪物血量
     * @param dh {Number}
     */
    hpChange(dh) {
        if (this.hp + dh <= 0) {
            this.hp = 0;
            return;
        } else if (this.hp + dh >= this.maxHp) {
            this.hp = this.maxHp;
            return;
        }
        this.hp += dh;
    }

    /**
     * 半径改变
     * @param dr {Number}
     */
    bodyRadiusChange(dr) {
        if (this.r + dr <= 0) {
            this.r = 0;
        } else {
            this.r += dr;
        }
    }

    /**
     * 死亡检测
     * @returns {boolean}
     */
    isDead() {
        if (this.maxHp < 0) {
            // 该实体不含有血量，一直属于存活
            return true;
        }
        return this.hp <= 0;
    }

    /**
     * 移动
     */
    remove() {
        this.pos.x = -10000;
        this.pos.y = -10000;
    }

    getBodyCircle() {
        return new Circle(this.pos.x, this.pos.y, this.r);
    }

    move() {
        // 移动
        if (this.acceleration.x === this.acceleration.y && this.acceleration.x === 0) {
            this.speed.add(this.speed.mul(this.accelerationV));
        } else {
            this.speed.add(this.acceleration);
        }
        this.pos.add(this.speed);
    }

    isInScreen() {
        let xIn = -this.r < this.pos.x && this.pos.x < this.world.width + this.r;
        let yIn = -this.r < this.pos.y && this.pos.y < this.world.height + this.r;
        return xIn && yIn;
    }


    /**
     * 渲染
     * @param ctx
     */
    render(ctx) {
        let hpRate = this.hp / this.maxHp;
        // 渲染身体
        let c = this.getBodyCircle();
        if (this.isDead()) {
            c.setColor(230, 230, 230, 1);
            c.setStrokeWidth(0);
            c.setStrokeColorStr("transparent");
        } else {
            c.setStrokeColor(this.bodyStrokeColor);
            c.setStrokeWidth(this.bodyStrokeWidth * hpRate);
            c.setColor(...this.bodyColor);
        }
        c.render(ctx);

        // 这是一个有血量的实体，渲染血量条
        if (this.maxHp > 0) {
            if (!this.isDead()) {
                let barH = this.hpBarHeight;
                // 血条边框
                let rectB = new Rectangle(this.pos.x - this.r, this.pos.y - this.r - 2.5 * barH, this.r * 2, barH);
                rectB.setStrokeWidth(1);
                rectB.setFillColor(0, 0, 0, 0);
                rectB.setStrokeColor(1, 1, 1);
                rectB.render(ctx);
                // 血条填充
                let rect = new Rectangle(this.pos.x - this.r, this.pos.y - this.r - 2.5 * barH, this.r * 2 * hpRate, barH);
                rect.setStrokeWidth(0);
                rect.setFillColor(...this.hpColor);
                rect.render(ctx);
                // 血条写数字
                let txt = Math.floor(this.hp).toString();
                ctx.fillStyle = "black";
                ctx.font = "9px Microsoft YaHei";
                ctx.textAlign = "center";
                //垂直对齐方式
                ctx.textBaseline = "top";
                ctx.fillText(txt, this.pos.x, this.pos.y - this.r - 2.5 * barH + 1);
            }
        }
    }

}
