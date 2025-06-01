import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

const stats = [
	{ value: 2500, label: 'Active Users', suffix: '+' },
	{ value: 150000, label: 'Messages Sent', suffix: '+' },
	{ value: 99.9, label: 'Uptime', suffix: '%' },
	{ value: 15, label: 'New Features', suffix: '/mo' }
];

const Counter = ({ end, duration = 2, prefix = '', suffix = '', trigger }) => {
	const [count, setCount] = useState(0);

	useEffect(() => {
		if (!trigger) return;
		let start = 0;
		const increment = end / (duration * 60);
		const timer = setInterval(() => {
			start += increment;
			setCount(Math.floor(start));
			if (start >= end) {
				setCount(end);
				clearInterval(timer);
			}
		}, 1000 / 60);
		return () => clearInterval(timer);
	}, [end, duration, trigger]);

	return (
		<span>
			{prefix}
			{count.toLocaleString()}
			{suffix}
		</span>
	);
};

const StatsSection = () => {
	const [isStatsVisible, setIsStatsVisible] = useState(false);
	const statsRef = useRef(null);

	useEffect(() => {
		const observer = new window.IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) {
					setIsStatsVisible(true);
					observer.disconnect();
				}
			},
			{ threshold: 0.3 }
		);
		if (statsRef.current) observer.observe(statsRef.current);
		return () => observer.disconnect();
	}, []);

	return (
		<section ref={statsRef} className="py-16 bg-dark-950/90">
			<div className="container mx-auto px-4">
				<div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
					{stats.map((stat, i) => (
						<motion.div
							key={i}
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6, delay: i * 0.1 }}
							className="p-6 rounded-xl bg-dark-800/50 backdrop-blur-sm border border-dark-700"
						>
							<h3 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-indigo-400">
								{isStatsVisible ? (
									<Counter end={stat.value} suffix={stat.suffix} trigger={isStatsVisible} />
								) : (
									`0${stat.suffix}`
								)}
							</h3>
							<p className="text-dark-300 mt-2">{stat.label}</p>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
};

export default StatsSection;
