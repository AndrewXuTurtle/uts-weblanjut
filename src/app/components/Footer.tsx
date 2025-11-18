"use client";

import { FiMail, FiPhone, FiMapPin, FiGithub, FiLinkedin, FiInstagram } from "react-icons/fi";

const quickLinks = [
	{ label: "Beranda", href: "/beranda" },
	{ label: "Profil", href: "/profil" },
	{ label: "Dosen", href: "/dosen" },
	{ label: "Mahasiswa", href: "/mahasiswa" },
	{ label: "Mata Kuliah", href: "/matakuliah" },
	{ label: "Penelitian", href: "/penelitian" },
	{ label: "PKM", href: "/pkm" },
	{ label: "Live Chat", href: "#", isChat: true },
];

export default function Footer() {
	const handleLinkClick = (link: { label: string; href: string; isChat?: boolean }, e: React.MouseEvent) => {
		if (link.isChat) {
			e.preventDefault();
			// Dispatch custom event to open floating chat
			window.dispatchEvent(new CustomEvent('openFloatingChat'));
		}
	};

	return (
		<footer className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-white pt-12 pb-8 px-4">
			<div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
				{/* About Section */}
				<div className="space-y-4">
					<h3 className="text-2xl font-bold">
						Teknik Perangkat Lunak
					</h3>
					<p className="text-blue-50 text-sm leading-relaxed">
						Program Studi yang berfokus pada pengembangan perangkat lunak berkualitas tinggi
						dengan standar industri modern.
					</p>
				</div>

				{/* Quick Links */}
				<div className="space-y-4">
					<h4 className="text-lg font-semibold">Tautan Cepat</h4>
					<ul className="space-y-2">
						{quickLinks.map((link) => (
							<li key={link.href}>
								<a
									href={link.isChat ? "#" : link.href}
									onClick={(e) => handleLinkClick(link, e)}
									className="text-blue-50 hover:text-white transition-colors duration-200 text-sm block cursor-pointer"
								>
									{link.label}
								</a>
							</li>
						))}
					</ul>
				</div>

				{/* Contact Info */}
				<div className="space-y-4">
					<h4 className="text-lg font-semibold">Hubungi Kami</h4>
					<div className="space-y-3">
						<div className="flex items-center space-x-3 text-blue-50">
							<FiMapPin className="w-5 h-5 text-white" />
							<span className="text-sm">Jl. Universitas No. 123, Kota, Indonesia</span>
						</div>
						<div className="flex items-center space-x-3 text-blue-50">
							<FiPhone className="w-5 h-5 text-white" />
							<span className="text-sm">+62 123 4567 890</span>
						</div>
						<div className="flex items-center space-x-3 text-blue-50">
							<FiMail className="w-5 h-5 text-white" />
							<span className="text-sm">info@universitaskita.ac.id</span>
						</div>
					</div>

					{/* Social Media */}
					<div className="flex space-x-4 pt-4">
						{[
							{ icon: FiGithub, href: "#" },
							{ icon: FiLinkedin, href: "#" },
							{ icon: FiInstagram, href: "#" },
						].map((social, index) => (
							<a
								key={index}
								href={social.href}
								className="text-blue-50 hover:text-white transition-colors duration-200"
								target="_blank"
								rel="noopener noreferrer"
							>
								<social.icon className="w-6 h-6" />
							</a>
						))}
					</div>
				</div>
			</div>

			{/* Copyright */}
			<div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/20">
				<p className="text-center text-blue-50 text-sm">
					© {new Date().getFullYear()} Teknik Perangkat Lunak. All rights reserved.
				</p>
			</div>
		</footer>
	);
}